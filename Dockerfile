FROM node:12.16.1

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install

COPY . /usr/src/bot
EXPOSE 8080
CMD ["node", "bot.js"]

