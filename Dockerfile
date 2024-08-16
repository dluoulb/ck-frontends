FROM node:22-alpine AS base

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

ARG FONTAWESOME_NPM_AUTH_TOKEN
ENV FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_HTTP_BASIC_AUTH
ENV NEXT_PUBLIC_HTTP_BASIC_AUTH=$NEXT_PUBLIC_HTTP_BASIC_AUTH

ARG NEXT_PUBLIC_API_BASIC_AUTH
ENV NEXT_PUBLIC_API_BASIC_AUTH=$NEXT_PUBLIC_API_BASIC_AUTH

ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_ID


# Setup env variables for yarn and nextjs
# https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# update dependencies, add libc6-compat and dumb-init to the base image
RUN apk update && apk upgrade && apk add --no-cache libc6-compat dumb-init jq

# install and use yarn 4.x
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

# add the user and group we'll need in our final image
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install dependencies only when needed
FROM base AS builder
WORKDIR /app

ARG FONTAWESOME_NPM_AUTH_TOKEN
ENV FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN

COPY .npmrc package.json package-lock.json tsconfig.json postcss.config.js next.config.js tailwind.config.js global.css middleware.ts next-env.d.ts ./

RUN npm install --only=production

FROM builder AS dev

RUN NODE_ENV=development npm install --save-dev

COPY ./shared ./shared
COPY ./types ./types
COPY ./apps ./apps
COPY ./pages ./pages
COPY ./public ./public

CMD ["dumb-init","npm","run", "dev"]

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV FONTAWESOME_NPM_AUTH_TOKEN=

# copy the public folder from the project as this is not included in the build process
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# copy the standalone folder inside the .next folder generated from the build process
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# copy the static folder inside the .next folder generated from the build process
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY ./deploy/bin/entrypoint.sh /usr/local/bin/entrypoint.sh

USER nextjs

CMD ["dumb-init","node","server.js"]
