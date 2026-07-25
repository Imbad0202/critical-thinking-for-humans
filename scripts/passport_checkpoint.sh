#!/bin/sh
#
# Stable entry point for the Node.js stdlib Passport checkpoint worker.

set -eu

EX_UNAVAILABLE=69
NODE_BIN=$(command -v node 2>/dev/null || :)
if [ -z "$NODE_BIN" ]; then
    echo "passport_checkpoint: Node.js 22+ is required for the local Passport; recording remains paused" >&2
    exit "$EX_UNAVAILABLE"
fi
NODE_MAJOR=$(
    "$NODE_BIN" -p 'Number(process.versions.node.split(".")[0])' 2>/dev/null ||
        :
)
case "$NODE_MAJOR" in
    ''|*[!0-9]*)
        echo "passport_checkpoint: cannot verify Node.js 22+; recording remains paused" >&2
        exit "$EX_UNAVAILABLE"
        ;;
esac
if [ "$NODE_MAJOR" -lt 22 ]; then
    echo "passport_checkpoint: Node.js 22+ is required for the local Passport; recording remains paused" >&2
    exit "$EX_UNAVAILABLE"
fi

SCRIPT_DIR=$(CDPATH='' cd "$(dirname "$0")" && pwd -P)
exec "$NODE_BIN" "$SCRIPT_DIR/passport_checkpoint.mjs" "$@"
