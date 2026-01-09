# Stage 1: Node.js สำหรับ Prisma
FROM node:24-alpine AS prisma-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx prisma generate

# Stage 2: Bun runtime
FROM oven/bun:1.3.3-slim
WORKDIR /app
COPY --from=prisma-build /app ./

EXPOSE 3000
CMD ["bun", "run", "start"]
