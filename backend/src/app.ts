import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'InterviewDock API is running' });
  });

  // API Routes
  app.use('/api', routes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
