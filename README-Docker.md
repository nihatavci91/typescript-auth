# TypeScript Auth API — Docker ile çalıştırma

## 1. Gerekli package.json scriptleri

`package.json` içindeki `scripts` alanında en az şunlar bulunmalıdır:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate:dev": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy"
  }
}
```

## 2. Docker environment dosyasını oluştur

PowerShell:

```powershell
Copy-Item .env.docker.example .env.docker
```

CMD:

```cmd
copy .env.docker.example .env.docker
```

## 3. İlk migration henüz oluşturulmadıysa

Önce sadece MySQL'i çalıştır:

```bash
docker compose up -d mysql
```

İlk migration'ı API container'ı içinden oluştur:

```bash
docker compose run --rm api npx prisma migrate dev --name create_users_table
```

Sonra tüm sistemi çalıştır:

```bash
docker compose up --build
```

## 4. Migration klasörü zaten varsa

Direkt çalıştır:

```bash
docker compose up --build
```

## 5. Adresler

API:

```text
http://localhost:3000
```

Register:

```text
POST http://localhost:3000/api/auth/register
```

MySQL'e bilgisayardan bağlanırken:

```text
Host: localhost
Port: 3307
User: root
Password: root12345
Database: ts_auth_api
```

API container'ı içinden MySQL adresi:

```text
mysql:3306
```

## 6. Logları görüntüle

```bash
docker compose logs -f
```

Yalnızca API:

```bash
docker compose logs -f api
```

Yalnızca MySQL:

```bash
docker compose logs -f mysql
```

## 7. Container durumları

```bash
docker compose ps
```

## 8. Sistemi durdur

```bash
docker compose down
```

Veritabanı volume'u korunur.

Veritabanı dahil her şeyi silmek için:

```bash
docker compose down -v
```

Dikkat: `-v`, MySQL verilerini kalıcı olarak siler.
