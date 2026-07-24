# 每日案件：Vercel 部署與出題手冊

每日案件機制可以留在 public repo；未發布案件、答案、解析與憑證不能進 Git。
瀏覽器只會取得公開題面，作答後由 Serverless API 在伺服器端判定。

## 資料邊界

| 位置 | 可以放什麼 | 不可以放什麼 |
| --- | --- | --- |
| `content/daily/` | 公開題面、選項、來源路徑、14 日 rotation（七日 demo＋七日來源可信度題組） | 正解、評語對照、解析、密鑰 |
| `.private/daily/` | 預定案件的 private record | 任何要 commit 的檔案 |
| Private Vercel Blob | `scheduled/` 與 `published/` 的完整 private record | 公開存取權限 |
| `/api/daily` | 已清理的公開題面與是否可作答 | 答案 record |
| `/api/answer` | 單次作答結果與該次回饋 | 整份答案表 |

`.private/`、`.env*` 與 `.vercel/` 已由專案 `.gitignore` 排除；`web/.vercelignore`
另行阻止 Vercel CLI 把本機檔案帶進 deployment。兩者是不同邊界，不能互相
替代。上傳前仍應執行 `git status --short`，確認沒有 private record 被追蹤。

## 1. 建立 Vercel 專案

1. 在 Vercel 匯入此 repository，將 **Root Directory** 設為 `web`。
2. 在專案中建立並連接一個 **Private Vercel Blob** store。
3. 在 Production environment 設定：

   ```text
   DAILY_CONTENT_PROVIDER=blob
   DAILY_BLOB_PREFIX=daily
   DAILY_PUBLISH_OFFSET_DAYS=1
   CRON_SECRET=<a-long-random-secret>
   ```

   `CRON_SECRET` 可在本機以 `openssl rand -hex 32` 產生；不要貼進 issue、log
   或 commit。Blob integration 會提供 project auth；若專案仍使用 token-based
   auth，Vercel environment 也必須有 `BLOB_READ_WRITE_TOKEN`。

4. 部署 Production。`vercel.json` 的 cron 是 `0 8 * * *`：每天 08:00 UTC
   （台北 16:00）把「下一個台北日」的 record 從 `scheduled/` 驗證並發布到
   `published/`。Vercel Cron 只在 Production deployment 執行。

Blob 內的實際路徑會是：

```text
daily/scheduled/YYYY-MM-DD.json  ->  daily/published/YYYY-MM-DD.json
```

若修改 `DAILY_BLOB_PREFIX`，API、cron 與本機 uploader 必須使用同一個值。

## 2. 在本機準備 private record

先安裝 web runtime dependency，並取得已連接專案的環境變數：

```sh
cd web
npm ci
vercel link
vercel env pull .env.local --environment production
mkdir -p .private/daily
cp scripts/templates/daily-private-record.template.json .private/daily/2099-01-01.json
```

模板刻意使用無效 placeholder，因此不含任何實際案件答案，也不能直接上傳。
檔名必須與 `publishDate` 完全相同；完成內容後才會通過 validator。

Private record 有兩種合法關聯方式：

- `contentId` 對應 `content/daily/cases/` 內已 commit 的公開題面；record 只保存
  `answers`。
- 新題面尚未存在於 repo 時，在 record 內加上 `case`，格式與
  `daily-case-public.v1.schema.json` 相同。案件發布時 `/api/daily` 只送出這個
  `case`，`answers` 仍留在 Private Blob。內嵌 `case.publishDate` 必須與 record
  的 `publishDate` 及檔名日期完全相同。

Choice case 的每一題都必須有且只有一個 answer entry；scene case 的
`answers` 必須是空陣列。所有 option verdict 若有提供，必須完整涵蓋公開選項。

## 3. 先 dry-run，再上傳

Dry-run 不載入 Blob SDK、不需要憑證，也不會發出網路請求：

```sh
node scripts/upload-daily.mjs --dry-run
node scripts/upload-daily.mjs --dry-run --date 2099-01-01
```

正式上傳時，Node 需要 `BLOB_READ_WRITE_TOKEN` 或 `VERCEL_OIDC_TOKEN`。本機
Vercel CLI 通常需要 Production 的 Blob token；`env pull` 不會自行創造 OIDC
憑證。若拉下來的 `.env.local` 包含 token，可直接執行：

```sh
node --env-file=.env.local scripts/upload-daily.mjs --date 2099-01-01
```

若不想把憑證寫入本機檔案，可讓 Vercel CLI 暫時注入 Production 環境：

```sh
vercel env run --environment production -- \
  node scripts/upload-daily.mjs --date 2099-01-01
```

Uploader 會先把所有選取檔案全部驗證完，才開始寫入 Private Blob。它不輸出
題面、回饋、答案、token 或 Blob URL。相同 record 重跑視為成功；同日期已有
不同內容時會停止且不覆寫，需先在 Vercel Blob 管理介面確認並處理衝突。

若今天的 Cron 時段已過，可在明確指定單一天的情況下立即發布；此操作仍會重新
驗證 scheduled record，且不同內容不會覆寫：

```sh
node --env-file=.env.local scripts/upload-daily.mjs --date 2099-01-01 --publish
```

## 4. 驗證發布

Cron 執行後檢查：

```sh
curl -sS https://<your-domain>/api/daily
```

預期結果包含伺服器決定的台北日期、`contentId`、公開 `case`，以及
`answerable: true` / `gradingAvailable: true`（scene 不評分，後者會是 false）。
回應中不應出現 `answers`、`correctOptionId`、`hitFeedback` 或 `missFeedback`。

需要在同一天手動重跑 cron 時：

```sh
curl -sS \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://<your-domain>/api/cron/publish-daily
```

不要把實際 secret 寫進 shell history；較安全的作法是由 secret manager 注入
環境變數。Cron 不會自動 retry，因此 production monitoring 應對非 2xx 發出警報。

## 失敗時的行為

- 找不到當日 `published/` record 時，`/api/daily` 仍可回傳循環 demo 預覽，
  但 `answerable` 與 `gradingAvailable` 為 false。若 Private Blob 已連線、只是
  record 尚未發布，這個 fallback 最多在 CDN 快取 60 秒，讓同日手動補發可以
  很快生效；未設定 private provider 的純 demo 部署仍可快取到台北午夜。
- Blob 或 grading 暫時不可用時，既有四種本機固定模式仍可玩，不依賴 API。
- `401` 的 cron 通常表示 `CRON_SECRET` 未部署或不一致。
- `answerable: false` 通常表示日期路徑、prefix、publish offset 或 cron 發布狀態
  未對齊；以伺服器回傳日期為準，不要用瀏覽器本機日期猜測。

## 更新與輪替原則

每日案件是 skill 內容的「版本化快照」，不會在 skill 更新後自動重寫已排程的
題目。更新來源後應重新檢查 `canonicalSourcePaths`、題面與 private feedback，
通過 dry-run 後再排新日期；已發布案件則保留原版，避免玩家在同一天看到答案
語義突然改變。

唯一例外是尚未公開宣傳前的 seed reset。這必須是一次性、明確記錄的管理員
migration：先驗證全部新版 record，再以同一份完整快照更新 `scheduled/`，並只
針對已發布日期同步更新 `published/`。正常 uploader 永遠不覆寫；正式上線後也
不得把 seed reset 當成一般編輯流程。
