import http from 'http';
import { createHttpTerminator } from 'http-terminator';

import app from './app';
import config from './config/config';
import nodeErrorHandler from './middlewares/nodeErrorHandler';
import gracefulExit from './utils/gracefulExit';
import logger from './utils/logger';

const { port } = config;
if (!port) throw new Error('App Port not assigned.');

const server = http.createServer(app);
const httpTerminator = createHttpTerminator({ server });

server.listen(port, () => {
  logger.info(`🚀 Server running at http://localhost:${port}`);
});

server.on('error', nodeErrorHandler);

// Erros globais
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  gracefulExit(httpTerminator, 1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  gracefulExit(httpTerminator, 1);
});

// Sinais do sistema
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM');
  gracefulExit(httpTerminator, 0);
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT');
  gracefulExit(httpTerminator, 0);
});

export { server, httpTerminator };
