# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy all source files
COPY . .

# Build the NestJS project
RUN npm run build


# ---------- RUNNER STAGE ----------
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only necessary files
COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/dist /app/dist

EXPOSE 4000

CMD ["node", "dist/main.js"]