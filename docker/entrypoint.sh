#!/bin/sh

# Substitutes the APP_NEXT_PUBLIC_DOCSEARCH_* placeholders baked into the
# client bundle at build time (from the committed .env) with the real values
# passed via the container environment, then starts the server.
#
# NEXT_PUBLIC_* values are compiled into the client bundle, so this rewrite is
# what lets one image serve any environment's DocSearch credentials.

set -eu

NEXT_PUBLIC_DOCSEARCH_APP_ID=${NEXT_PUBLIC_DOCSEARCH_APP_ID:-"none"}
NEXT_PUBLIC_DOCSEARCH_API_KEY=${NEXT_PUBLIC_DOCSEARCH_API_KEY:-"none"}
NEXT_PUBLIC_DOCSEARCH_INDEX_NAME=${NEXT_PUBLIC_DOCSEARCH_INDEX_NAME:-"none"}

# Escape the characters that are special in a sed replacement (\ and &) and
# our s### delimiter (#), so values containing them substitute literally.
escape() {
  printf '%s' "$1" | sed -e 's/[\\&#]/\\&/g'
}

# Rewrite only the files that still contain the placeholder — after the first
# boot substituted everything, restarts touch nothing. grep exiting 1 on zero
# matches is fine: xargs -r then runs nothing and the pipeline succeeds.
substitute() {
  grep -rlZ "$1" /usr/app/.next | xargs -0 -r sed -i "s#$1#$2#g"
}

if substitute APP_NEXT_PUBLIC_DOCSEARCH_APP_ID "$(escape "$NEXT_PUBLIC_DOCSEARCH_APP_ID")" &&
   substitute APP_NEXT_PUBLIC_DOCSEARCH_API_KEY "$(escape "$NEXT_PUBLIC_DOCSEARCH_API_KEY")" &&
   substitute APP_NEXT_PUBLIC_DOCSEARCH_INDEX_NAME "$(escape "$NEXT_PUBLIC_DOCSEARCH_INDEX_NAME")"; then
  echo "DocSearch configuration applied"
else
  # Serve the docs even if search wiring failed — a docs site with broken
  # search beats a crash-looping container. The warning makes it visible.
  echo "WARNING: DocSearch placeholder substitution failed; search may be broken" >&2
fi

echo "starting Next.js"
exec "$@"
