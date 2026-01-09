FROM oven/bun:1.3.3-slim

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

# generate Prisma ตอน container run
CMD ["sh", "-c", "bunx prisma generate && bun run start"]
