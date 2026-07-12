# Optimized Web derivatives

These files are delivery derivatives of the canonical generated art in
`../backgrounds/`; they are not additional generated scenes and are not counted
in the 44-item art manifest.

`mode-cards/*.webp` uses a 720×480, quality-58 WebP derivative for the opening
selector. Briefing and gameplay screens continue to use the canonical 1536×1024
files.

Rebuild pattern:

```bash
cwebp -resize 720 480 -q 58 SOURCE.webp -o mode-cards/MODE.webp
```
