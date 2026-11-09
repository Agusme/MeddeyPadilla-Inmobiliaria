# SEO y publicación del dominio

La configuración central está en `lib/seo.ts`. No se usa el host de la petición ni VERCEL_URL para generar canónicas. `NEXT_PUBLIC_SITE_URL` deja de utilizarse.

## Antes del lanzamiento

En Vercel, para el servicio frontend:

```env
SITE_URL=
SEO_INDEXING_ENABLED=false
```

El HTML incluye noindex y las respuestas del frontend incluyen X-Robots-Tag. robots.txt permite el rastreo para que Google pueda detectar esa instrucción. El sitemap queda vacío y robots.txt no lo anuncia. No se generan canónicas mientras no exista SITE_URL.

## Al conectar el dominio comprado en DonWeb

1. Agregar el dominio en el proyecto de Vercel y configurar en DonWeb los registros DNS que Vercel indique. Esperar a que el dominio y HTTPS estén activos.
2. Elegir un único dominio principal (con www o sin www) y redirigir la otra variante al principal desde Vercel.
3. En las variables del frontend, entorno **Production**, configurar lo siguiente con el dominio real:

```env
SITE_URL=https://tu-dominio.com.ar
SEO_INDEXING_ENABLED=true
```

4. Volver a desplegar el frontend: los metadatos y robots.txt se generan también durante el build. Cambiar variables sin desplegar no basta.
5. Mantener `SEO_INDEXING_ENABLED=false` en Preview y Development. La implementación también deshabilita indexación si VERCEL_ENV no es production. Los hosts que no coinciden con SITE_URL siguen recibiendo X-Robots-Tag: noindex, nofollow, incluida la URL temporal.
6. Comprobar el dominio principal: canónicas absolutas correctas, metadatos index/follow, ausencia de X-Robots-Tag noindex en páginas públicas, `/robots.txt` con Allow y Sitemap, `/sitemap.xml` con páginas públicas y fichas publicadas. `/admin` debe seguir teniendo noindex.
7. Verificar el dominio en Google Search Console mediante DNS y enviar `https://tu-dominio.com.ar/sitemap.xml`.

La web continúa alojada en Vercel; comprar el dominio en DonWeb no requiere trasladar el alojamiento.

## API para SEO de propiedades

Las fichas obtienen sus datos en el servidor para entregar contenido, metadatos y JSON-LD en el HTML. La galería y los controles conservan su implementación. El sitemap usa el mismo endpoint público, que devuelve solo propiedades publicadas. Un fallo de API produce un error de servidor; no se convierte en una propiedad inexistente ni en un sitemap vacío aparentemente válido. Solo una respuesta 404 o una propiedad no publicada produce notFound.

En Vercel, `vercel.json` declara un binding del servicio `front` al servicio `back`. Vercel inyecta automáticamente `BACKEND_INTERNAL_URL` en tiempo de ejecución; **no crear esa variable manualmente en el dashboard**. Next usa esa conexión interna tanto para fichas como para el sitemap, sin depender del dominio público, VERCEL_URL ni Deployment Protection. El prefijo `/api` se conserva porque Express monta las rutas en `/api/properties`.

`API_SERVER_URL` queda como alternativa para un backend independiente o pruebas locales de producción y debe contener su origen, sin `/api`. En desarrollo, si no se configura ninguna variable, usa `http://localhost:4000`. El binding tiene prioridad sobre API_SERVER_URL. Eliminar un valor manual de BACKEND_INTERNAL_URL si ya existiera para que Vercel pueda generar el correcto. No es necesario agregar variables de API en Vercel para esta arquitectura; sí volver a desplegar el proyecto completo con el nuevo vercel.json.

Las URLs del backend se usan exclusivamente para consultas del servidor, nunca para canónicas. Los errores HTTP de API, fallos de conexión y respuestas HTML producen errores de servidor; solo una respuesta JSON 404 del endpoint de una propiedad o un estado no publicado invoca notFound().

Los datos estructurados incluyen RealEstateAgent con datos publicados de la inmobiliaria y RealEstateListing para fichas. No se inventan valoraciones ni se promete un resultado enriquecido en Google.

## Validación local

`npm run build` comprueba compilación y tipos. `node tests/seo.integration.mjs` ejecuta dos builds y levanta servidores de prueba con una API simulada en los puertos 4199 y 3198; comprueba prepublicación y lanzamiento, canónicas, robots, sitemap, fichas, 404 y exclusión del panel y del host temporal. Ejecutarlo con esos puertos libres y sin otro build simultáneo. El último build usa example.com como dominio de prueba: realizar un build con las variables reales antes de publicar.
