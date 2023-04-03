FROM node:18-alpine as BUILD

WORKDIR /api-gateway

COPY package.json ./
RUN yarn

COPY . ./

FROM node:18-alpine

COPY --from=BUILD /api-gateway/node_modules ./node_modules
WORKDIR /api-gateway

EXPOSE 3010
CMD ["yarn", "start:dev"]