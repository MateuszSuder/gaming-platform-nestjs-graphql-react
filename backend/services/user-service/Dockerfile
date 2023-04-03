FROM node:18-alpine as BUILD

WORKDIR /user-service

COPY package.json ./
RUN yarn

COPY . ./

FROM node:18-alpine

COPY --from=BUILD /user-service/node_modules ./node_modules
WORKDIR /user-service

CMD ["yarn", "start:dev"]