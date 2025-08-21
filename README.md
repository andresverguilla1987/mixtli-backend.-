# Mixtli Backend Ready (Railway)

## Cómo usar este ZIP
1. **Sube** TODO el contenido de esta carpeta a tu repo de GitHub `mixtli-backend` (no subas el .zip, sube los archivos y carpetas).
2. En **Railway → + New → GitHub Repo**, elige el repo y despliega.
3. Ve a **Service → Variables** y copia los valores de `.env` (con tus datos reales).
4. Ejecuta en **Service → Shell**:
   ```
   npx prisma generate
   npx prisma migrate deploy
   ```

## Endpoints
- `POST /api/upload/request`
- `POST /api/upload/confirm`
- `GET  /api/download/:token`
- `POST /api/send`
