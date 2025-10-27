import { StatusCodes } from 'http-status-codes';

import BaseError from './BaseError';

/**
 * Represents a 401 Unauthorized error (invalid or missing credentials).
 */
class UnauthorizedError extends BaseError {
  constructor(details: string) {
    super('UnauthorizedError', StatusCodes.UNAUTHORIZED, details, true);
  }
}

export default UnauthorizedError;
