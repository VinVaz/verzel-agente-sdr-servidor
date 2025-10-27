import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import genericErrorHandler from './middlewares/genericErrorHandler';
import httpLogger from './middlewares/httpLogger';
import notFoundHandler from './middlewares/notFoundHandler';
import rateLimitMiddleware from './middlewares/rateLimitHandler';
import transactionHandler from './middlewares/transactionHandler';
import routes from './routes';

const app: express.Application = express();

// --- Security and request handling middlewares ---
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Custom middlewares ---
app.use(transactionHandler);
app.use(rateLimitMiddleware);
app.use(httpLogger);

// --- Routes ---
app.use('/', routes);

app.use(notFoundHandler);
app.use(genericErrorHandler);

export default app;
