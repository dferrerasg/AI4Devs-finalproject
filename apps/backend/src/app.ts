import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from '@/config/env';
import authRouter from '@/interfaces/http/routes/auth.routes';
import { projectRoutes } from '@/interfaces/http/routes/project.routes';
import { layerRoutes } from '@/interfaces/http/routes/layer.routes';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/plans/:planId/layers', layerRoutes);

// Health Check
app.get('/health', (req, res) => {

  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;
