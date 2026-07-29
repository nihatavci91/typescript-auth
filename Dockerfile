FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Önce bağımlılık dosyalarını kopyalayarak Docker cache'inden yararlanırız.
COPY package*.json ./

RUN npm ci

# Projenin kalanını kopyala.
COPY . .

# Prisma Client oluştur.
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
