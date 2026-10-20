import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.js';
import { authRouter } from './routes/auth.js';
import { examsRouter } from './routes/exams.js';
import { questionsRouter } from './routes/questions.js';
import { subRouter } from './routes/submissions.js';
import { resultsRouter } from './routes/results.js';
import { alertsRouter } from './routes/alerts.js';
import { adminRouter } from './routes/admin.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

  app.use('/api/auth', authRouter);
  app.use('/api/exams', examsRouter);
  app.use('/api/questions', questionsRouter);
  app.use('/api/submissions', subRouter);
  app.use('/api/results', resultsRouter);
  app.use('/api/alerts', alertsRouter);
  app.use('/api/admin', adminRouter);

  app.use(errorHandler);
  return app;
}