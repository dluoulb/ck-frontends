FROM node:22.22.0-alpine AS base

ARG FONTAWESOME_NPM_AUTH_TOKEN
ENV FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN

# Setup env variables for yarn and nextjs
# https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# update dependencies, add libc6-compat and dumb-init to the base image
RUN apk update && apk upgrade && apk add --no-cache libc6-compat dumb-init jq

# # install and use yarn 4.x
# RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

# add the user and group we'll need in our final image
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install dependencies only when needed
FROM base AS builder
WORKDIR /app

COPY .npmrc package.json package-lock.json tsconfig.json postcss.config.js next.config.js globals.css middleware.ts next-env.d.ts ./

ENV NODE_ENV=production
RUN npm install --only=production

COPY ./shared ./shared
COPY ./types ./types
COPY ./apps ./apps
COPY ./pages ./pages
COPY ./public ./public

# Bake app env vars into the Next.js bundle at build time when the secret is provided.
# The secret is optional so local dev builds work without it (env vars come from .env.docker instead).
RUN --mount=type=secret,id=app-env,required=false \
    [ -f /run/secrets/app-env ] && cat /run/secrets/app-env >> .env.production || true && \
    npm run build

FROM builder AS dev

RUN NODE_ENV=development npm install --save-dev

CMD ["dumb-init","npm","run", "dev"]


FROM base AS runner
WORKDIR /app

RUN apk add --no-cache bash openssl su-exec
RUN npm i sharp

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

COPY ./deploy/bin/entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
CMD ["dumb-init","node","server.js"]
