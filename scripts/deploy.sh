#!/usr/bin/env bash
# Oskun Matikkapaja 1.0 – julkaisu osoitteeseen https://3lm.fi/matikkapaja/
#
# Käyttö (TinyMonkeyllä, repon kansiossa):
#   bash scripts/deploy.sh             julkaise nykyinen commit
#   bash scripts/deploy.sh --rollback  palaa edelliseen julkaisuun
#
# Jokainen julkaisu menee omaan kansioonsa releases/-hakemistoon, ja käytössä
# oleva versio vaihdetaan symlinkillä yhdellä atomisella siirrolla. Viisi
# uusinta julkaisua säilytetään, joten paluu edelliseen on aina mahdollinen.
set -euo pipefail

ROOT=${DEPLOY_ROOT:-/var/www/oskun-matikkapaja}
RELEASES=$ROOT/releases
LINK=$ROOT/public/matikkapaja
URL=${DEPLOY_URL:-https://3lm.fi/matikkapaja/}
KEEP=5

fail() { echo "Virhe: $*" >&2; exit 1; }

use_release() {
  ln -sfn "../releases/$1" "$LINK.new"
  mv -T "$LINK.new" "$LINK"
  echo "Käytössä nyt: $1"
}

if [ "${1:-}" = "--rollback" ]; then
  [ -L "$LINK" ] || fail "yhtään julkaisua ei ole vielä tehty."
  current=$(basename "$(readlink "$LINK")")
  previous=$(ls -1 "$RELEASES" | sort | awk -v c="$current" '$0 == c { print p; exit } { p = $0 }')
  [ -n "$previous" ] || fail "aiempaa julkaisua ei ole."
  use_release "$previous"
  exit 0
fi

cd "$(git rev-parse --show-toplevel)"

# Julkaistaan vain sitä, mikä on oikeasti GitHubissa
[ -z "$(git status --porcelain)" ] || fail "commitoimattomia muutoksia. Commitoi tai peru ne ensin."
[ "$(git branch --show-current)" = main ] || fail "julkaise vain main-haarasta."
git fetch --quiet origin main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || fail "paikallinen main ei vastaa GitHubia. Aja git push tai git pull."

sha=$(git rev-parse --short HEAD)
name="$(date +%Y%m%d-%H%M%S)-$sha"
echo "Julkaistaan $name"

# Samat tarkistukset kuin CI:ssä
npm ci --no-audit --no-fund
npm run lint
npm test
npm run build

mkdir -p "$RELEASES/$name" "$(dirname "$LINK")"
cp -r dist/. "$RELEASES/$name/"
echo "$sha" > "$RELEASES/$name/version.txt"
chmod -R a+rX "$RELEASES/$name"
use_release "$name"

# Vanhimmat pois, käytössä olevaa ei koskaan
ls -1 "$RELEASES" | sort | head -n -"$KEEP" | while read -r old; do
  [ "$old" = "$name" ] || rm -rf "${RELEASES:?}/$old"
done

if curl -fsS -o /dev/null "$URL"; then
  echo "OK: $URL (versio $sha)"
else
  echo "Huom: $URL ei vastannut. Tarkista Nginx." >&2
fi
