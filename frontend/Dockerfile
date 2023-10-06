FROM node:14.17.0

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY ./ ./

ENTRYPOINT []
CMD ["yarn", "start"]
