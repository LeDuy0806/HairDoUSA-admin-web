# Step 1: Build the application
FROM node:20-alpine AS base

FROM base as deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM base as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_URL

RUN npm run build

# Step 2: Serve the application with a lightweight static file server
FROM base as runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist /app/dist

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "/app/dist", "-l", "3000"]
