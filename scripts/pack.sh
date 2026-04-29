#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION=$(node -e "console.log(require('./manifest.json').version)")
OUT="github-pr-tab-rewriter-${VERSION}.zip"

rm -f "$OUT"
zip -r "$OUT" \
  manifest.json \
  content.js \
  popup.html popup.js \
  options.html options.js \
  icons/ \
  README.md \
  -x "*.DS_Store" "*.git*"

echo "Wrote $OUT"
unzip -l "$OUT"
