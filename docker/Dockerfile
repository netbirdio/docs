FROM node:20-alpine

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm install --production

# Copy all files
COPY ./ ./

COPY /docker/entrypoint.sh ./entrypoint.sh

# Build app
RUN npm run build

RUN chmod u+x /usr/app/entrypoint.sh

# Expose the listening port
EXPOSE 3000

# apply env variables to the Nextjs .env file
ENTRYPOINT ["/usr/app/entrypoint.sh"]

CMD npm run start