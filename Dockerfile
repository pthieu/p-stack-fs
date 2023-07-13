ARG ALPINE_VERSION=3.17

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY panda.config.ts ./

RUN npm i -g pnpm && pnpm i --prod --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# XXX(Phong): Panda is built in the `prepare` command, which runs after
# `install`, so we copy it over here for building
COPY --from=deps /app/src/styles ./src/styles

RUN ["chmod", "+x", "./docker-entrypoint.sh"]

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm i -g pnpm
RUN pnpm run build

# Production image, copy all the files and run next
FROM alpine:${ALPINE_VERSION} AS runner

WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache --update nodejs
# XXX(Phong): Get AWS SSM Params using a Go binary, reduces image size
# Note: this might get a "8: not found" error if not using the USER nextjs, has
# to do with something with the ca-certificates
RUN apk update && apk add --no-cache ca-certificates && update-ca-certificates
RUN wget https://github.com/pthieu/go-aws-get-parameter/raw/master/ssm_get_parameter
RUN ["chmod", "+x", "./ssm_get_parameter"]

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/src/db/migrations ./migrations

COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./

USER nextjs

EXPOSE 80

ENV PORT 80

ENTRYPOINT [ "sh", "docker-entrypoint.sh" ]
CMD ["node", "server.js"]
# For debugging, keeps container alive
# CMD ["tail", "-f", "/dev/null"]
