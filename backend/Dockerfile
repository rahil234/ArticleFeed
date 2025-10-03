FROM node:22-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine as runner

WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD sh -c "npm run prisma:migrate && npm run start:dev"
