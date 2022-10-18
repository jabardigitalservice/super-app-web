FROM node:lts-alpine as builder

WORKDIR /app

COPY . .

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

ARG API_KEY
ARG SENTRY_DSN
ARG SENTRY_SAMPLE_RATE
ARG SENTRY_ENABLED
ENV API_KEY $API_KEY
ENV SENTRY_DSN $SENTRY_DSN
ENV SENTRY_SAMPLE_RATE $SENTRY_SAMPLE_RATE
ENV SENTRY_ENABLED $SENTRY_ENABLED

RUN yarn build

RUN rm -rf node_modules && \
  NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app  .

ENV HOST 0.0.0.0
EXPOSE 3000

CMD [ "yarn", "start" ]
