# Setup

Project ini pakai:

- Vercel Blob untuk file gambar
- MySQL untuk metadata foto

## Environment Variables

Isi di Vercel:

- `BLOB_READ_WRITE_TOKEN`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_SSL`

`MYSQL_SSL=false` hanya kalau database kamu memang tidak pakai SSL.

## Database

Jalankan schema di [database/schema.sql](/c:/Users/aldiy/Documents/GitHub/forIrene/database/schema.sql:1).

## Flow

1. Frontend upload file ke `/api/photos`
2. API simpan file ke Vercel Blob
3. API simpan metadata ke MySQL
4. Frontend mengambil daftar foto dari MySQL saat load halaman
