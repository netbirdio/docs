#!/usr/bin/env bash
# Is <tag> the newest stable netbird release? Prints true or false, with the
# reasoning on stderr. Used by generate_api_pages.yml before generating and
# again just before pushing, so the API pages only ever follow the newest
# release, whatever order the dispatches arrive in.
#
# Usage: scripts/newest-netbird-release.sh refs/tags/v0.82.0   (or v0.82.0)
#
# Only vMAJOR.MINOR.PATCH counts: release candidates and canary builds of
# unmerged pull requests are never the newest release. Leaving them out of the
# comparison also keeps sort -V from ordering v0.82.0-rc.1 after v0.82.0.
#
# Exits 1 when it can't tell. The tag being asked about is always among
# netbird's tags, so a list without it is broken, and a guess could regress
# the pages.
set -euo pipefail

tag="${1:?usage: $0 <tag>}"
tag="${tag#refs/tags/}"
if [[ ! "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "${tag} is not a stable release; the API pages follow releases only" >&2
  echo false
  exit 0
fi

all=$(git ls-remote --tags --refs https://github.com/netbirdio/netbird.git 'v*' | sed 's#.*refs/tags/##')
tags=$(grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' <<<"$all" || true)
if ! grep -qxF "$tag" <<<"$tags"; then
  echo "${tag} is not among netbird's release tags; refusing to decide on a broken tag list" >&2
  exit 1
fi

newest=$(sort -V <<<"$tags" | tail -1)
if [[ "$tag" != "$newest" ]]; then
  echo "${tag} is older than ${newest}; leaving the API pages alone" >&2
  echo false
  exit 0
fi
echo "${tag} is the newest release" >&2
echo true
