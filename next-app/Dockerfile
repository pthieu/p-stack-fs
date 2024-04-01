ARG ALPINE_VERSION=3.17
# If ARG is named the same as the ENV var, will get replaed by it
ARG ARG_SSM_BASE_PATH

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm i -g pnpm && pnpm i --prod --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

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

ARG ARG_SSM_BASE_PATH
ENV SSM_BASE_PATH=$ARG_SSM_BASE_PATH
RUN echo "SSM_BASE_PATH is set to: $SSM_BASE_PATH"
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache --update nodejs
# XXX(Phong): Get AWS SSM Params using a Go binary, reduces image size
# Note: this might get a "8: not found" error if not using the USER nextjs, has
# to do with something with the ca-certificates
RUN apk update && apk add --no-cache ca-certificates && update-ca-certificates
RUN wget https://github.com/pthieu/go-aws-get-parameter/releases/download/v1.0.0-arm64/ssm_get_parameter
RUN ["chmod", "+x", "./ssm_get_parameter"]

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/next.config.js ./

COPY --from=builder /app/docker-entrypoint.sh ./

EXPOSE 80

ENV PORT 80

ENTRYPOINT [ "sh", "docker-entrypoint.sh" ]
CMD ["node", "server.js"]
# For debugging, keeps container alive
# CMD ["tail", "-f", "/dev/null"]
