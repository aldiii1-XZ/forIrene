import { put } from "@vercel/blob";
import { getPool } from "./_lib/mysql.js";

const PHOTO_PREFIX = "photos/";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

function sanitizeCaption(caption) {
  return (caption || "").trim().replace(/\s+/g, " ").slice(0, 120);
}

function buildPathname(file, caption) {
  const safeCaption = encodeURIComponent(sanitizeCaption(caption) || "memory");
  const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "jpg";
  return `${PHOTO_PREFIX}${Date.now()}__${safeCaption}.${extension}`;
}

async function listAllPhotos() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, image_url, caption, storage_path, created_at
     FROM photos
     ORDER BY created_at ASC, id ASC`
  );

  return rows.map((row) => ({
    id: row.id,
    src: row.image_url,
    caption: row.caption,
    uploadedAt: row.created_at,
    pathname: row.storage_path,
  }));
}

export async function GET() {
  try {
    const photos = await listAllPhotos();
    return json({ photos });
  } catch (error) {
    return json(
      { error: "Gagal mengambil daftar foto.", detail: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const pool = getPool();
    const formData = await request.formData();
    const file = formData.get("file");
    const caption = sanitizeCaption(formData.get("caption"));

    if (!(file instanceof File)) {
      return json({ error: "File foto wajib diisi." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return json({ error: "File harus berupa gambar." }, { status: 400 });
    }

    const blob = await put(buildPathname(file, caption), file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    const [result] = await pool.execute(
      `INSERT INTO photos (image_url, caption, storage_path)
       VALUES (?, ?, ?)`,
      [blob.url, caption || "Memory", blob.pathname]
    );

    return json({
      photo: {
        id: result.insertId,
        src: blob.url,
        caption: caption || "Memory",
        uploadedAt: new Date().toISOString(),
        pathname: blob.pathname,
      },
    });
  } catch (error) {
    return json(
      { error: "Upload foto gagal.", detail: error.message },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, OPTIONS",
    },
  });
}
