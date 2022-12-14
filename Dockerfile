FROM node:16.13.0-alpine3.14

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG API_KEY
ARG SENTRY_DSN
ARG SENTRY_SAMPLE_RATE
ARG SENTRY_ENABLED
ARG GOOGLE_ANALYTICS_ID
ENV API_KEY $API_KEY
ENV SENTRY_DSN $SENTRY_DSN
ENV SENTRY_SAMPLE_RATE $SENTRY_SAMPLE_RATE
ENV SENTRY_ENABLED $SENTRY_ENABLED
ENV HOST 0.0.0.0
ENV PORT 3000
ENV GOOGLE_ANALYTICS_ID $GOOGLE_ANALYTICS_ID

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
