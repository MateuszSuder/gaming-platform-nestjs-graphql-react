FROM node:18-alpine as BUILD

WORKDIR /auth-service

COPY package.json ./
RUN yarn

COPY . ./

FROM node:18

COPY --from=BUILD /auth-service/node_modules ./node_modules
WORKDIR /auth-service

CMD ["yarn", "start:dev"]