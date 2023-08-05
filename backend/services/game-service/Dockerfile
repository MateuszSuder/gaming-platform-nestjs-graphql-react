FROM node:18 as BUILD

WORKDIR /game-service

COPY package.json ./
RUN yarn

COPY . ./

FROM node:18

COPY --from=BUILD /game-service/node_modules ./node_modules
WORKDIR /game-service

CMD ["yarn", "start:dev"]