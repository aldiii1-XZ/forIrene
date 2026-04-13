import { getPool } from './_lib/mysql.js';

function jsonStringify(data) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export default async function handler(request) {
  const pool = getPool();
  const stream = new ReadableStream({
    async start(controller) {
      let lastPhotoId = 0;
      let pollInterval;

      // Fetch initial recent photos on connect
      try {
        const [recentRows] = await pool.query(
          'SELECT id, image_url, caption, storage_path, created_at FROM photos WHERE id > ? ORDER BY id ASC LIMIT 10',
          [lastPhotoId]
        );

        if (recentRows.length > 0) {
          controller.enqueue(jsonStringify({
            type: 'recent_photos',
            photos: recentRows.map(row => ({
              id: row.id,
              src: row.image_url,
              caption: row.caption,
              uploadedAt: row.created_at,
              pathname: row.storage_path,
            }))
          }));
          lastPhotoId = Math.max(...recentRows.map(r => r.id));
        }
      } catch (error) {
        controller.enqueue(jsonStringify({ type: 'error', message: error.message }));
      }

      // Poll for new photos every 2 seconds
      pollInterval = setInterval(async () => {
        try {
          const [newRows] = await pool.query(
            'SELECT id, image_url, caption, storage_path, created_at FROM photos WHERE id > ? ORDER BY id ASC',
            [lastPhotoId]
          );

          if (newRows.length > 0) {
            controller.enqueue(jsonStringify({
              type: 'new_photo',
              photo: {
                id: newRows[0].id,
                src: newRows[0].image_url,
                caption: newRows[0].caption,
                uploadedAt: newRows[0].created_at,
                pathname: newRows[0].storage_path,
              }
            }));
            lastPhotoId = Math.max(...newRows.map(r => r.id));
          }
        } catch (error) {
          controller.enqueue(jsonStringify({ type: 'error', message: error.message }));
        }
      }, 2000);

      request.signal.addEventListener('abort', () => {
        clearInterval(pollInterval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

