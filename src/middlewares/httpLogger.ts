import { NextFunction, Request, Response } from 'express';

import config from '../config/config'; // assuming your env config is here
import context from '../utils/context';
import sanitizeError from '../utils/error/sanitizeError';
import logger from '../utils/logger';

const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  // Skip logging entirely for dev and test environments
  if (config.environment === 'development' || config.environment === 'test') {
    return next();
  }

  const start = Date.now();
  const transactionId = context?.getStore()?.get('transactionId') || '-';

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    if (status === 404) return;

    const logPayload = {
      transactionId,
      method: req.method,
      url: req.originalUrl,
      status,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      duration: `${duration}ms`,
      query: sanitizeError(req.query as Record<string, unknown>),
      body: sanitizeError(req.body)
    };

    if (status >= 500) {
      logger.error({ ...logPayload, message: 'Server error' });
    } else if (status >= 400) {
      logger.warn({ ...logPayload, message: 'Client error' });
    } else {
      logger.info({ ...logPayload, message: 'Request handled successfully' });
    }
  });

  next();
};

export default httpLogger;
