FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i --frozen-lockfile; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

RUN npm install -g pnpm && pnpm i --prod --frozen-lockfile

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
RUN pnpm build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM alpine AS runner
RUN apk add --update nodejs
RUN apk add --update npm

WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/src/db/ ./db
# COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./env
COPY --from=builder /app/.next/static ./.next/static
COPY package.json package-lock.json* pnpm-lock.yaml* ./

COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./

# If we keep `package.json`, `pnpm i <package>` seems to install everything
RUN mv package.json package.json.bak
RUN npm i -g pnpm
# For some reason, node_modules gets replaced if we install locally so we
# install globally and the global path must be in PATH
# We could also install next/react/react-dom but we want to maintain the version
# and also their dependencies bloat the image
ENV PNPM_HOME=/usr/local/bin
RUN pnpm add -g vite-node drizzle-kit
RUN mv package.json.bak package.json

USER nextjs

EXPOSE 80

ENV PORT 80

ENTRYPOINT [ "sh", "docker-entrypoint.sh" ]
CMD ["pnpm", "run", "serve:prod"]
# For debugging, keeps container alive
# CMD ["tail", "-f", "/dev/null"]
