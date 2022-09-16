FROM node:16.15.0-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM node:16.15.0-alpine AS prod-builder

WORKDIR /app
COPY --from=builder /app/build ./build
COPY package.json .
COPY yarn.lock .
COPY tsconfig.prod.json ./tsconfig.json
RUN yarn install --frozen-lockfile --no-cache --prod

FROM node:16.15.0-alpine AS be

WORKDIR /app
COPY --from=prod-builder /app/ ./

CMD ["yarn", "start"]
