import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { ZodError } from 'zod';
import { config } from './config.ts';
import { database } from './database.ts';
import { HttpError } from './errors.ts';
import { apiRouter } from './routes/api.ts';

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use((request, response, next) => {
  const origin = request.get('origin');
  if (origin && !config.allowedOrigins.has(origin)) {
    response.status(403).json({ error: 'Origin is not allowed.' });
    return;
  }

  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  response.setHeader('Access-Control-Max-Age', '600');

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: '16kb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1_000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  }),
);

app.get('/health', async (_request, response) => {
  try {
    await database.query('SELECT 1');
    response.status(200).json({ status: 'ok' });
  } catch {
    response.status(503).json({ status: 'unavailable' });
  }
});

app.use('/api', apiRouter);

const errorHandler: ErrorRequestHandler = (error: unknown, request, response, _next) => {
  if (response.headersSent) return;
  if (error instanceof ZodError) {
    response.status(400).json({ error: 'Invalid request data.' });
    return;
  }
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error(`Request failed: ${request.method} ${request.path}`);
  response.status(500).json({ error: 'An unexpected error occurred.' });
};

app.use(errorHandler);
