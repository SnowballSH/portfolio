#!/usr/bin/env sh
# Renders scripts/og/og.html to public/og.jpg with headless Chrome and ffmpeg.
set -eu
cd "$(dirname "$0")/../.."
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$chrome" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --allow-file-access-from-files --virtual-time-budget=2000 \
  --window-size=1200,630 --screenshot="$tmp/og.png" \
  "file://$PWD/scripts/og/og.html"
ffmpeg -loglevel error -y -i "$tmp/og.png" -q:v 3 public/og.jpg
