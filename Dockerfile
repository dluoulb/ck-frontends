FROM node:22.23.2-alpine AS base

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

COPY .npmrc package.json package-lock.json tsconfig.json postcss.config.js next.config.js globals.css middleware.ts instrumentation-client.ts next-env.d.ts ./

ENV NODE_ENV=production
RUN --mount=type=secret,id=fontawesome-npm-auth-token,required=false \
    export FONTAWESOME_NPM_AUTH_TOKEN="$(cat /run/secrets/fontawesome-npm-auth-token 2>/dev/null || true)" && \
    npm ci --include=dev

COPY ./shared ./shared
COPY ./types ./types
COPY ./apps ./apps
COPY ./pages ./pages
COPY ./public ./public
COPY ./__tests__ ./__tests__
COPY jest.config.ts jest.setup.ts ./
COPY Dockerfile compose.yml ./
COPY ./.github/workflows/deploy.yml ./.github/workflows/deploy.yml
COPY ./.github/workflows/format-lint-test.yml ./.github/workflows/format-lint-test.yml
COPY ./deploy ./deploy

# Bake app env vars into the Next.js bundle at build time when the secret is provided.
# The secret is optional so local dev builds work without it (env vars come from .env.docker instead).
RUN --mount=type=secret,id=app-env,required=false \
    [ -f /run/secrets/app-env ] && cat /run/secrets/app-env >> .env.production || true && \
    npm run build

RUN npm prune --omit=dev

FROM builder AS dev

ENV NODE_ENV=development
RUN NODE_ENV=development npm install --save-dev

CMD ["dumb-init","npm","run", "dev"]


FROM base AS runner
WORKDIR /app

RUN apk add --no-cache bash openssl su-exec

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

RUN npm cache clean --force && \
    rm -rf /root/.npm /usr/local/lib/node_modules/npm && \
    rm -f /usr/local/bin/npm /usr/local/bin/npx

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

COPY ./deploy/bin/entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
CMD ["dumb-init","node","server.js"]
