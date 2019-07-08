FROM node:12-alpine as build

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

# optimizes build time
FROM node:12-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app .
# Copy those package jsons from the build above

COPY . ./

ENV HOST 0.0.0.0
ENV NODE_ENV production

RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
