import express from 'express';
import cors from 'cors';
import compression from 'compression';
import * as helmetModule from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chefRoutes from './routes/chefRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
app.set('trust proxy', 1);

const helmet = (helmetModule as unknown as {
  default: (options?: Record<string, unknown>) => express.RequestHandler;
}).default;

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: (requestOrigin, callback) => {
    if (!requestOrigin || env.corsOrigins.includes(requestOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin is not allowed by CORS.'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 2000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (request: express.Request) => request.path === '/health'
}));
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));

const publicCache = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.method !== 'GET' || req.path.startsWith('/admin')) {
    next();
    return;
  }

  res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  next();
};

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'FlavorFlow API',
      status: 'ok'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/foods', publicCache, foodRoutes);
app.use('/api/categories', publicCache, categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chef', chefRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const port = env.port;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

export default app;
