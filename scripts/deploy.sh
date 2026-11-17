#!/usr/bin/env bash
# Deploy to https://3lm.fi/matikkapaja/ (usage: see README.md)
set -euo pipefail

ROOT=${DEPLOY_ROOT:-/var/www/oskun-matikkapaja}
RELEASES=$ROOT/releases
LINK=$ROOT/public/matikkapaja
URL=${DEPLOY_URL:-https://3lm.fi/matikkapaja/}
KEEP=5

fail() { echo "Error: $*" >&2; exit 1; }

# Atomic switch: rename over the old symlink
use_release() {
  ln -sfn "../releases/$1" "$LINK.new"
  mv -T "$LINK.new" "$LINK"
  echo "Now serving: $1"
}

if [ "${1:-}" = "--rollback" ]; then
  [ -L "$LINK" ] || fail "nothing has been deployed yet."
  current=$(basename "$(readlink "$LINK")")
  previous=$(ls -1 "$RELEASES" | sort | awk -v c="$current" '$0 == c { print p; exit } { p = $0 }')
  [ -n "$previous" ] || fail "no earlier release to roll back to."
  use_release "$previous"
  exit 0
fi

cd "$(git rev-parse --show-toplevel)"

# Only deploy what is on GitHub
[ -z "$(git status --porcelain)" ] || fail "uncommitted changes. Commit or discard them first."
[ "$(git branch --show-current)" = main ] || fail "deploy from the main branch only."
git fetch --quiet origin main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || fail "local main differs from GitHub. Run git push or git pull."

sha=$(git rev-parse --short HEAD)
name="$(date +%Y%m%d-%H%M%S)-$sha"
echo "Deploying $name"

# Same checks as CI
npm ci --no-audit --no-fund
npm run lint
npm test
npm run build

mkdir -p "$RELEASES/$name" "$(dirname "$LINK")"
cp -r dist/. "$RELEASES/$name/"
echo "$sha" > "$RELEASES/$name/version.txt"
chmod -R a+rX "$RELEASES/$name"
use_release "$name"

# Keep the newest releases, never the one in use
ls -1 "$RELEASES" | sort | head -n -"$KEEP" | while read -r old; do
  [ "$old" = "$name" ] || rm -rf "${RELEASES:?}/$old"
done

if curl -fsS -o /dev/null "$URL"; then
  echo "OK: $URL (version $sha)"
else
  echo "Warning: $URL did not respond. Check Nginx." >&2
fi
