import cors from 'cors';
import express from 'express';
import { corsOptions } from './config/cors';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
import { postRateLimit } from './middleware/rateLimit';
import { securityHeaders } from './middleware/security';
import routes from './routes';

/** Largest legitimate body is a 2000-character message; 16kb leaves ample room. */
const JSON_BODY_LIMIT = '16kb';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.trustProxy);

  app.use(securityHeaders);
  // CORS first, so 4xx/429/500 responses are also readable by allowed browser origins.
  app.use(cors(corsOptions));
  // Before body parsing, so oversized or malformed floods are counted too.
  app.use(postRateLimit);
  app.use(express.json({ limit: JSON_BODY_LIMIT }));

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
