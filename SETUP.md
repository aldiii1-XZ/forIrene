# Setup - Real-Time Galaxy Photos

Project ini pakai:
- Vercel Blob untuk simpan gambar
- MySQL untuk metadata foto  
- Server-Sent Events (SSE) untuk update real-time

## Local Development (MySQL)

1. **Install MySQL** (XAMPP, Homebrew, atau official installer)
2. **Buat database & user** (contoh):
   ```
   CREATE DATABASE galaxy_photos;
   CREATE USER 'galaxy'@'localhost' IDENTIFIED BY 'password123';
   GRANT ALL ON galaxy_photos.* TO 'galaxy'@'localhost';
   ```
3. **Setup .env**:
   ```
   cp .env.example .env
   # Edit .env sesuai config MySQL kamu
   ```
4. **Import schema**:
   ```
   mysql -u galaxy -p galaxy_photos < database/schema.sql
   ```

## Environment Variables

**Local (.env)** & **Vercel**:
```
BLOB_READ_WRITE_TOKEN=... (dari Vercel dashboard)
MYSQL_HOST=localhost (atau remote/PlanetScale)
MYSQL_PORT=3306
MYSQL_USER=galaxy
MYSQL_PASSWORD=password123
MYSQL_DATABASE=galaxy_photos
MYSQL_SSL=false  # true untuk SSL DB
```

## Development Server

```
npx serve .
# Atau buka galaxy.html langsung di browser (API butuh server untuk Vercel runtime)
# Untuk full test: Deploy ke Vercel dulu, atau setup local Vercel dev
npx vercel dev
```

## Real-Time Testing

1. Buka 2 tab: galaxy.html
2. Upload foto di tab 1
3. Lihat auto muncul di tab 2 dalam ~2 detik (via SSE /api/sse)

## Deployment (Vercel)

1. Push ke GitHub
2. Connect repo di Vercel
3. Tambah env vars di Vercel dashboard
4. Deploy otomatis

## Flow Lengkap

1. Upload → Vercel Blob + MySQL insert
2. SSE detect new photo → broadcast ke semua client
3. Client auto prepend + re-render 3D galaxy
