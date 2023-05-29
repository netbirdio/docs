#!/bin/sh

# this script will check for the following NEXT_* environment variables passed via Docker environment (-e) and apply them
# to the Nextjs.
# The properties that will be replaced and have to start with APP_ prefix in the .env file

set -ex
NEXT_PUBLIC_DOCSEARCH_APP_ID=${NEXT_PUBLIC_DOCSEARCH_APP_ID:-"none"}
NEXT_PUBLIC_DOCSEARCH_API_KEY=${NEXT_PUBLIC_DOCSEARCH_API_KEY:-"none"}
NEXT_PUBLIC_DOCSEARCH_INDEX_NAME=${NEXT_PUBLIC_DOCSEARCH_INDEX_NAME:"none"}

find /usr/app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_DOCSEARCH_APP_ID#${NEXT_PUBLIC_DOCSEARCH_APP_ID}#g"
find /usr/app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_DOCSEARCH_API_KEY#${NEXT_PUBLIC_DOCSEARCH_API_KEY}#g"
find /usr/app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_DOCSEARCH_INDEX_NAME#${NEXT_PUBLIC_DOCSEARCH_INDEX_NAME}#g"

echo "starting Nextjs"
exec "$@"