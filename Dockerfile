FROM node:16.19.1-alpine

# Directory
WORKDIR /usr/src/node-api

# Install dependencies
COPY ./package.json ./
RUN npm install --omit=dev