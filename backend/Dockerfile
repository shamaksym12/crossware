FROM node:fermium

RUN apt-get update && apt-get install -y \
      wget \
      xz-utils

WORKDIR /tmp

RUN wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz \
      && tar Jxvf ffmpeg-release-amd64-static.tar.xz \
      && cp ./ffmpeg*amd64-static/ffmpeg /usr/local/bin/

WORKDIR /app

COPY package.json ./
RUN yarn install

RUN mkdir /cache

COPY ./ ./

ENTRYPOINT []
CMD ["yarn", "start"]