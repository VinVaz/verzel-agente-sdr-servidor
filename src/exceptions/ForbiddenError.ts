import { StatusCodes } from 'http-status-codes';

import BaseError from './BaseError';

/**
 * Represents a 403 Forbidden error (user not allowed to perform action).
 */
class ForbiddenError extends BaseError {
  constructor(details: string) {
    super('ForbiddenError', StatusCodes.FORBIDDEN, details, true);
  }
}

export default ForbiddenError;
