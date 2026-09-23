#!/usr/bin/env node

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const appRoot = path.resolve(__dirname, '..');
const portIndex = process.argv.indexOf('--port');
const requestedPort = portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT;
const port = Number(requestedPort || 4173);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

function resolveRequest(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const relativePath = decoded.replace(/^\/+/, '') || 'index.html';
  const filename = path.resolve(appRoot, relativePath);

  if (!filename.startsWith(`${appRoot}${path.sep}`) && filename !== appRoot) return null;
  return filename;
}

function serveFile(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const filename = resolveRequest(url.pathname);
  if (!filename) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.stat(filename, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    const extension = path.extname(filename).toLowerCase();
    response.writeHead(200, {
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.webp' ? 'public, max-age=86400' : 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    fs.createReadStream(filename).pipe(response);
  });
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid port: ${requestedPort}`);
}

http.createServer(serveFile).listen(port, () => {
  console.log(`Vascular Plant Atlas is running at http://localhost:${port}`);
});
