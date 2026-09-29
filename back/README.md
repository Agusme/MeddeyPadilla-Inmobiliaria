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

El alta y la edición aceptan `multipart/form-data` con el campo `images`, hasta 12 imágenes de 8 MB cada una.
