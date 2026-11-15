import 'dotenv/config';
import express, { type Request as ExpressRequest, type Response as ExpressResponse } from 'express';
import path from 'node:path';
import { runWithRequestHeaders } from './lib/request-context';
import { getSqliteD1 } from './lib/d1-sqlite';
import { GET as handleHome } from './app/route';
import { GET as handleStateGet, PUT as handleStatePut } from './app/api/state/route';
import { POST as handleAuthPost } from './app/api/auth/[action]/route';
import { GET as handleMarketBoardGet } from './app/api/market-board/route';
import { GET as handlePricesGet, POST as handlePricesPost } from './app/api/prices/[source]/route';
import { GET as handleAdminAccountsGet, PATCH as handleAdminAccountsPatch } from './app/api/admin/accounts/route';

// Initialize SQLite D1 database and run pending migrations at startup.
getSqliteD1();

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

app.use(
  express.static(path.join(process.cwd(), 'public'), {
    index: false,
    maxAge: '1h',
  }),
);

app.use(express.raw({ type: '*/*', limit: '2mb' }));

function toWebRequest(req: ExpressRequest): Request {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto =
    (typeof forwardedProto === 'string' ? forwardedProto.split(',')[0].trim() : '') ||
    req.protocol ||
    'http';
  const forwardedHost = req.headers['x-forwarded-host'];
  const host =
    (typeof forwardedHost === 'string' ? forwardedHost.split(',')[0].trim() : '') ||
    req.headers.host ||
    'localhost:3000';
  const url = `${proto}://${host}${req.originalUrl}`;

  const webHeaders = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) webHeaders.append(key, item);
    } else {
      webHeaders.set(key, value);
    }
  }

  const method = req.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';
  let body: BodyInit | undefined;
  if (hasBody && Buffer.isBuffer(req.body) && req.body.length > 0) {
    body = new Uint8Array(req.body);
  }

  return new Request(url, {
    method,
    headers: webHeaders,
    body,
  });
}

async function sendWebResponse(res: ExpressResponse, response: Response) {
  res.status(response.status);
  const setCookies =
    typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') return;
    res.setHeader(key, value);
  });
  for (const cookie of setCookies) {
    res.append('Set-Cookie', cookie);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  res.send(buffer);
}

function adapt(handler: (request: Request, context?: any) => Promise<Response>) {
  return async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const webRequest = toWebRequest(req);
      const response = await runWithRequestHeaders(webRequest.headers, () =>
        handler(webRequest, { params: Promise.resolve(req.params) }),
      );
      await sendWebResponse(res, response);
    } catch (error) {
      console.error('Route error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
      }
    }
  };
}

app.get('/', adapt(handleHome));
app.get('/api/state', adapt(handleStateGet));
app.put('/api/state', adapt(handleStatePut));
app.post('/api/auth/:action', adapt(handleAuthPost));
app.get('/api/market-board', adapt(handleMarketBoardGet));
app.get('/api/prices/:source', adapt(handlePricesGet));
app.post('/api/prices/:source', adapt(handlePricesPost));
app.get('/api/admin/accounts', adapt(handleAdminAccountsGet));
app.patch('/api/admin/accounts', adapt(handleAdminAccountsPatch));

const port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Sidaps Portfolio server listening on http://0.0.0.0:${port}`);
});
