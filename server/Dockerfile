FROM alekzonder/puppeteer:1.8.0-0
# https://github.com/alekzonder/docker-puppeteer
USER root
WORKDIR /home/pptruser/src

COPY package*.json ./
RUN npm install --only=production

COPY . ./

ENV NODE_ENV production

EXPOSE 9000
CMD [ "node", "server" ]
