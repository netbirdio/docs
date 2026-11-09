FROM node:20-slim

# tini runs as PID 1 and forwards signals to node (which doesn't install its
# own SIGTERM handler, and as PID 1 would otherwise ignore it) — so
# `docker stop` terminates in ~1s instead of waiting out the 10s kill grace.
RUN apt-get update \
    && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

ENV NODE_ENV=production
# Next's standalone server binds to localhost by default; listen on all
# interfaces inside the container, and pin the port.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Next's standalone output (built on the CI runner, see build_n_push.yml)
# bundles a minimal, traced node_modules plus server.js — there is nothing to
# install here. The output is traced against the runner (Ubuntu/glibc), so this
# runtime image must also be glibc (node:20-slim, NOT alpine/musl) or the traced
# native binaries won't load.
#
# Files are chowned to the non-root `node` user because entrypoint.sh rewrites
# the DocSearch placeholders in .next with `sed -i` at runtime — that needs
# write access under the runtime user.
COPY --chown=node:node .next/standalone ./
# standalone does not include static assets or the public dir — copy them in.
COPY --chown=node:node .next/static ./.next/static
COPY --chown=node:node public ./public

COPY --chown=node:node docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Run as the base image's built-in non-root user (UID 1000). Port 3000 is
# unprivileged, so no extra capability is needed.
USER node

EXPOSE 3000

# Surfaces crash-loops and dead servers in `docker ps` / compose --wait /
# Watchtower instead of them sitting silently "Up".
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# entrypoint.sh substitutes the APP_NEXT_PUBLIC_DOCSEARCH_* placeholders baked
# into .next with real values from the container env, then execs the CMD.
ENTRYPOINT ["/usr/bin/tini", "--", "/usr/app/entrypoint.sh"]

CMD ["node", "server.js"]
