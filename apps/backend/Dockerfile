FROM oven/bun:1.2.10-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/db/package.json packages/db/package.json

RUN bun install --frozen-lockfile

COPY apps/backend apps/backend
COPY packages/db packages/db

WORKDIR /app/apps/backend

EXPOSE 3001

CMD ["bun", "run", "start"]