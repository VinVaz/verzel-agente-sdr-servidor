import { Request, Response } from 'express';
import type { HttpTerminator } from 'http-terminator';

import { buildError, CustomError} from '../utils/error/errorBuilder';
import gracefulExit from '../utils/gracefulExit';
import logger from '../utils/logger';

const createGenericErrorHandler = (terminator?: HttpTerminator) => {
  return async (
    err: Error,
    _req: Request,
    res: Response
  ): Promise<void> => {
    const { response, isOperational } = buildError(err as CustomError);

    logger.error({
      type: isOperational ? 'APPLICATION_ERROR' : 'CRITICAL_ERROR',
      message: err.message || 'Unhandled error',
      statusCode: response.code,
      stack: err.stack,
    });

    res.status(response.code).json(response);

    if (!isOperational) {
      logger.error('⚠️ Critical error encountered. Triggering graceful shutdown...');
      if (terminator) await gracefulExit(terminator, 1);
      else process.exit(1);
    }
  };
};

export default createGenericErrorHandler;
