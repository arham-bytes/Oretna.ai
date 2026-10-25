import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './src/config/index.js';
import authRoutes from './src/routes/authRoutes.js';
import researchRoutes from './src/routes/researchRoutes.js';
import surveyRoutes from './src/routes/surveyRoutes.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-side Next.js rewrites, curl)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, '');
      const configuredFrontend = config.frontendUrl?.replace(/\/+$/, '');

      // Allow configured frontend, localhost, Vercel deployments, or oretna.ai
      if (
        !configuredFrontend ||
        normalizedOrigin === configuredFrontend ||
        normalizedOrigin.endsWith('.vercel.app') ||
        normalizedOrigin.includes('oretna.ai') ||
        normalizedOrigin.includes('localhost') ||
        normalizedOrigin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Request normalizer & logger
app.use((req, res, next) => {
  // Normalize double slashes or accidental duplicate /api/api
  req.url = req.url.replace(/\/{2,}/g, '/').replace(/^\/api\/api\//, '/api/');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root & Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Oretna.ai Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'oretna-backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes (supports both /api/* and root aliases)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/research', '/research'], researchRoutes);
app.use(['/api/survey', '/survey'], surveyRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Oretna backend server running on http://localhost:${config.port}`);
});
