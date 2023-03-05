FROM node:16.19.1-alpine

# Directory
WORKDIR /usr/src/node-api

# Install dependencies
COPY ./package.json ./
RUN npm install --production

# Copy project files
COPY ./dist ./dist

# Expose running port
EXPOSE 5000

# Run
CMD npm start