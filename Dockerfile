FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate
RUN npm run build
RUN npx tsc -p tsconfig.seed.json

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/generated ./dist/generated
COPY --from=builder /app/assets ./assets
COPY prisma.config.ts tsconfig.json ./
EXPOSE 3000
CMD npx prisma migrate deploy && npx prisma db seed && node dist/src/main