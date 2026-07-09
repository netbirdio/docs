FROM node:20-alpine

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install runtime dependencies (npm ci = clean, reproducible install from the lockfile)
RUN npm ci --omit=dev

# Copy the app, including the prebuilt .next output. The build now runs on the
# CI runner (see .github/workflows/build_n_push.yml) with a warm .next/cache,
# so there is no `npm run build` step here — we only package the result.
COPY ./ ./

COPY /docker/entrypoint.sh ./entrypoint.sh

RUN chmod u+x /usr/app/entrypoint.sh

# Expose the listening port
EXPOSE 3000

# apply env variables to the Nextjs .env file
ENTRYPOINT ["/usr/app/entrypoint.sh"]

CMD npm run start