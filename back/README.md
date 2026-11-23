# API Medde & Padilla

API REST con Node.js, Express, MongoDB y Mongoose.

## Inicio local

1. Copiá `.env.example` como `.env` y completá `MONGODB_URI`, `JWT_SECRET` y `ADMIN_PASSWORD_HASH`.
2. Ejecutá `npm install`.
3. Ejecutá `npm run dev`.

Podés usar MongoDB local o MongoDB Atlas. Los datos se crean al guardar la primera propiedad.

## Rutas

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/properties` y `GET /api/properties/:slug`
- `GET`, `POST`, `PATCH`, `DELETE /api/admin/properties` (requiere `Authorization: Bearer <token>`)

El alta y la edición aceptan `multipart/form-data` con el campo `images`, de hasta 8 MB por archivo. Cada propiedad admite hasta 30 imágenes en total, incluidas las que ya estaban guardadas.

## Subida directa de fotos

1. En un entorno de prueba con MongoDB Atlas (o un replica set) y Cloudinary, configurá las credenciales de Cloudinary solo en el backend. Activá `NEXT_PUBLIC_PROPERTY_IMAGE_UPLOAD=direct` en el frontend antes de compilar.
2. Probá el alta con 30 imágenes y la edición de una propiedad con fotos guardadas. Interrumpí una subida, reintentá desde el mismo formulario, mové una foto a portada y eliminá otra. Probá también repetir el guardado con la misma sesión después de perder la respuesta.
3. Antes de habilitarlo en producción, configurá `CRON_SECRET` en Vercel para la ruta diaria `/api/internal/property-upload-cleanup`. En otro host se puede programar un GET con `Authorization: Bearer <CRON_SECRET>`. En Preview se puede invocar del mismo modo para verificar el trabajo. Si hay que volver a multipart, quitá `NEXT_PUBLIC_PROPERTY_IMAGE_UPLOAD` y desplegá de nuevo.

La API de administración emite firmas para cada foto con `POST /api/admin/properties/upload-sessions/:id`. El navegador envía los originales a Cloudinary de a tres. El guardado `POST /api/admin/properties/upload-sessions/:id/save` verifica las referencias y registra la operación y su comprobante en la misma transacción. Mantener abierto el formulario permite reutilizar los archivos confirmados si falla el guardado. Los comprobantes se conservan para que un reintento del mismo guardado no vuelva a escribir datos.

Las sesiones admiten reintentos durante 24 horas. La limpieza de sus fotos pendientes y de las removidas desde la edición directa empieza después de 26 horas, de modo que hayan vencido las firmas emitidas. Antes de eliminar una foto verifica que no esté referenciada. Si Cloudinary no confirma un borrado, se conserva para una ejecución posterior.
