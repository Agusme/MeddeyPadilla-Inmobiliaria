import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';

// Run from front/. Uses a mock API and real production builds, without external data.
const api = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json');
  const apiPath = request.url.replace(/^\/internal\/back/, '');
  const property = {
    _id: '1', slug: 'casa-seo', title: 'Casa SEO', operation: 'Venta',
    propertyType: 'Casa', price: 100000, currency: 'USD', status: 'published',
    street: 'Calle 123', city: 'Tucuman', description: 'Casa de prueba para SEO',
    images: [], featured: false, createdAt: '2026-01-01',
  };
  if (apiPath === '/api/properties/api-failure') {
    response.statusCode = 503; response.end(JSON.stringify({ message: 'Database unavailable' })); return;
  }
  if (apiPath === '/api/properties/gateway-not-found') {
    response.statusCode = 404; response.setHeader('Content-Type', 'text/html'); response.end('<h1>Gateway not found</h1>'); return;
  }
  if (apiPath === '/api/properties/wrong-origin') {
    response.setHeader('Content-Type', 'text/html'); response.end('<h1>Frontend page</h1>'); return;
  }
  if (apiPath === '/api/properties/connection-failure') {
    request.socket.destroy(); return;
  }
  if (apiPath === '/api/properties/draft') {
    response.end(JSON.stringify({ ...property, status: 'draft' })); return;
  }
  if (apiPath === '/api/properties') response.end(JSON.stringify([property]));
  else if (apiPath === '/api/properties/casa-seo') response.end(JSON.stringify(property));
  else { response.statusCode = 404; response.end('{}'); }
});

function get(url, host) {
  return new Promise((resolve, reject) => {
    const request = http.get({
      hostname: 'localhost', port: 3198, path: url,
      headers: { 'user-agent': 'Googlebot', ...(host ? { host } : {}) },
    }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(new Response(Buffer.concat(chunks), {
        status: response.statusCode, headers: response.headers,
      })));
    });
    request.on('error', reject);
    request.setTimeout(15000, () => request.destroy(new Error('Request timeout')));
  });
}

async function run(enabled) {
  const env = {
    ...process.env, SITE_URL: enabled ? 'https://example.com' : '',
    SEO_INDEXING_ENABLED: String(enabled), VERCEL_ENV: 'production',
    // The binding must win over public deployment URLs and stale manual overrides.
    BACKEND_INTERNAL_URL: 'http://localhost:4199/internal/back/',
    API_SERVER_URL: 'http://127.0.0.1:1', VERCEL_URL: 'unreachable-deployment.vercel.app',
  };
  const build = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], { env, encoding: 'utf8' });
  assert.equal(build.status, 0, build.stdout + build.stderr);
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3198'], {
    env, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  child.stdout.on('data', data => logs += data);
  child.stderr.on('data', data => logs += data);
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try { await get('/robots.txt'); ready = true; break; }
      catch { await new Promise(resolve => setTimeout(resolve, 250)); }
    }
    assert(ready, logs);
    const home = await get('/', 'example.com');
    const html = await home.text();
    assert.equal(home.headers.get('x-robots-tag'), enabled ? null : 'noindex, nofollow');
    assert(html.includes(enabled ? 'index, follow' : 'noindex, follow'));
    assert.equal(html.includes('rel="canonical"'), enabled);
    assert(html.includes('RealEstateAgent'));
    const robots = await (await get('/robots.txt')).text();
    assert(robots.includes('Allow: /'));
    assert(!robots.includes('Disallow: /'));
    assert.equal(robots.includes('Sitemap:'), enabled);
    const sitemap = await (await get('/sitemap.xml')).text();
    assert.equal(sitemap.includes('https://example.com/propiedades/casa-seo'), enabled);
    assert(!sitemap.includes('/admin'));
    const property = await get('/propiedades/casa-seo', 'example.com');
    const propertyHtml = await property.text();
    assert.equal(property.status, 200);
    assert(propertyHtml.includes('<title>Casa SEO | Medde &amp; Padilla</title>'));
    assert(propertyHtml.includes('RealEstateListing'));
    assert(propertyHtml.includes('Casa de prueba para SEO'));
    for (const slug of ['api-failure', 'gateway-not-found', 'wrong-origin', 'connection-failure']) {
      assert.equal((await get('/propiedades/' + slug)).status, 500, slug + ' must not become a 404');
    }
    assert.equal((await get('/propiedades/draft')).status, 404);
    for (const missingPath of ['/pagina-inexistente', '/propiedades/no-existe']) {
      const missing = await get(missingPath);
      assert.equal(missing.status, 404);
      const missingHtml = await missing.text();
      assert(missingHtml.includes('No encontramos la página que buscás'));
      assert(missingHtml.includes('Ver propiedades'));
      assert(missingHtml.includes('Volver al inicio'));
      // Next 16.3 currently recovers dynamic notFound() responses via hydration.
      // Unmatched routes include the full layout directly in the HTML.
      if (missingPath === '/pagina-inexistente') {
        assert(missingHtml.includes('<nav'));
        assert(missingHtml.includes('<footer'));
      }
    }
    assert.equal((await get('/admin', 'example.com')).headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.equal((await get('/', 'temporal.vercel.app')).headers.get('x-robots-tag'), 'noindex, nofollow');
    console.log('PASS', enabled ? 'launch' : 'prelaunch', 'metadata, robots, sitemap, binding, property 200, missing/draft 404, API/network 500, admin, temporary host');
  } catch (error) {
    console.error(logs);
    throw error;
  } finally {
    if (child.exitCode === null) {
      const exited = new Promise(resolve => child.once('exit', resolve));
      child.kill();
      await exited;
    }
  }
}

await new Promise(resolve => api.listen(4199, resolve));
try { await run(false); await run(true); }
finally { api.close(); }
