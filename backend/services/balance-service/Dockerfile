FROM node:18-alpine as BUILD

WORKDIR /balance-service

COPY package.json ./
RUN yarn

COPY . ./

FROM node:18-alpine

COPY --from=BUILD /balance-service/node_modules ./node_modules
WORKDIR /balance-service

CMD ["yarn", "start:dev"]