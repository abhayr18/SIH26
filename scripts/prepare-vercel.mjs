import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distClientDir = path.join(rootDir, 'dist', 'client');
const distServerDir = path.join(rootDir, 'dist', 'server');
const vercelOutputDir = path.join(rootDir, '.vercel', 'output');
const vercelStaticDir = path.join(vercelOutputDir, 'static');
const vercelFunctionsDir = path.join(vercelOutputDir, 'functions');

console.log('[prepare-vercel] Starting Vercel deployment preparation...');

// 1. Load compiled server entry
const serverModulePath = path.join(distServerDir, 'index.js');
if (!fs.existsSync(serverModulePath)) {
  console.error('[prepare-vercel] dist/server/index.js not found! Please run vinext build first.');
  process.exit(1);
}

const serverModule = await import(pathToFileURL(serverModulePath).href);
const server = serverModule.default;

// 2. Prerender main pages
const routesToPrerender = [
  { path: '/', outDir: distClientDir, filename: 'index.html' },
  { path: '/login', outDir: path.join(distClientDir, 'login'), filename: 'index.html' },
  { path: '/privacy', outDir: path.join(distClientDir, 'privacy'), filename: 'index.html' },
];

for (const { path: routePath, outDir, filename } of routesToPrerender) {
  try {
    console.log(`[prepare-vercel] Prerendering ${routePath}...`);
    const res = await server.fetch(new Request(`http://localhost:3000${routePath}`));
    if (res.status === 200) {
      const html = await res.text();
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, filename), html, 'utf-8');
      console.log(`[prepare-vercel] Wrote ${path.join(outDir, filename)} (${html.length} bytes)`);
    } else {
      console.warn(`[prepare-vercel] Warning: ${routePath} returned status ${res.status}`);
    }
  } catch (err) {
    console.error(`[prepare-vercel] Failed to prerender ${routePath}:`, err);
  }
}

// 3. Prepare .vercel/output
console.log('[prepare-vercel] Constructing .vercel/output for Build Output API v3...');
fs.rmSync(vercelOutputDir, { recursive: true, force: true });
fs.mkdirSync(vercelStaticDir, { recursive: true });
fs.mkdirSync(vercelFunctionsDir, { recursive: true });

// Copy dist/client -> .vercel/output/static
fs.cpSync(distClientDir, vercelStaticDir, { recursive: true });
console.log('[prepare-vercel] Copied static assets to .vercel/output/static');

// 4. Create .vercel/output/config.json
const vercelConfig = {
  version: 3,
  routes: [
    { handle: 'filesystem' },
    { src: '^/api(?:/(.*))?$', dest: '/api?__route=$1' },
    { src: '^/login/?$', dest: '/login/index.html' },
    { src: '^/privacy/?$', dest: '/privacy/index.html' },
    { src: '^/.*$', dest: '/index.html' },
  ],
};
fs.writeFileSync(
  path.join(vercelOutputDir, 'config.json'),
  JSON.stringify(vercelConfig, null, 2),
  'utf-8'
);

// 5. Create .vercel/output/functions/api.func
const apiFuncDir = path.join(vercelFunctionsDir, 'api.func');
fs.mkdirSync(apiFuncDir, { recursive: true });

// Copy dist/server into api.func/server
fs.cpSync(distServerDir, path.join(apiFuncDir, 'server'), { recursive: true });

// Write api.func/.vc-config.json
const vcConfig = {
  runtime: 'nodejs20.x',
  handler: 'index.mjs',
  launcherType: 'Nodejs',
};
fs.writeFileSync(
  path.join(apiFuncDir, '.vc-config.json'),
  JSON.stringify(vcConfig, null, 2),
  'utf-8'
);

// Write api.func/index.mjs
const apiHandlerCode = `import server from './server/index.js';

export default async function handler(req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    
    let pathAndSearch = req.headers['x-forwarded-uri'] || req.headers['x-matched-path'] || req.url;
    if (pathAndSearch.startsWith('/api?') && req.url.includes('__route=')) {
      const parsed = new URL(req.url, 'http://localhost');
      const route = parsed.searchParams.get('__route') || '';
      parsed.searchParams.delete('__route');
      const qs = parsed.searchParams.toString();
      pathAndSearch = \`/api/\${route}\${qs ? '?' + qs : ''}\`;
    }
    const url = new URL(pathAndSearch, \`\${protocol}://\${host}\`);

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks);

    const webReq = new Request(url.href, {
      method: req.method,
      headers: req.headers,
      body: body && body.length ? body : undefined,
      duplex: 'half',
    });

    const webRes = await server.fetch(webReq);
    res.statusCode = webRes.status;
    for (const [k, v] of webRes.headers.entries()) {
      res.setHeader(k, v);
    }
    const buf = Buffer.from(await webRes.arrayBuffer());
    res.end(buf);
  } catch (err) {
    console.error('[ThermoWatch API Error]', err);
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Internal Server Error',
        message: String(err?.message || err),
      })
    );
  }
}
`;
fs.writeFileSync(path.join(apiFuncDir, 'index.mjs'), apiHandlerCode, 'utf-8');

console.log('[prepare-vercel] Vercel Build Output API v3 successfully created in .vercel/output!');
