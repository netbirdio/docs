FROM node:20-slim

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
COPY .next/standalone ./
# standalone does not include static assets or the public dir — copy them in.
COPY .next/static ./.next/static
COPY public ./public

COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

# entrypoint.sh substitutes the APP_NEXT_PUBLIC_DOCSEARCH_* placeholders baked
# into .next with real values from the container env, then execs the CMD.
ENTRYPOINT ["/usr/app/entrypoint.sh"]

CMD ["node", "server.js"]
