import { StatusCodes } from 'http-status-codes';

import BaseError from './BaseError';

class BadRequestError extends BaseError {
  constructor(details: string) {
    super('BadRequestError', StatusCodes.BAD_REQUEST, details, true);
  }
}

export default BadRequestError;
