import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import APIResponseInterface from '../../domain/responses/APIResponse';
import BaseError from '../../exceptions/BaseError';
import logger from '../logger';


export interface CustomError extends Error {
  isJoi?: boolean;
  isBoom?: boolean;
  details?: { path: (string | number)[]; message: string }[];
  output?: { statusCode: number; payload: { message?: string; error?: string } };
  statusCode?: number;
  isOperational: boolean;
}

export const buildError = (
  err: CustomError
): {
  response: APIResponseInterface<{ details?: { param: string; message: string }[] }>;
  isOperational: boolean;
} => {
  if (err.isJoi && err.details) {
    return {
      response: {
        code: StatusCodes.BAD_REQUEST,
        message: 'Validation failed',
        data: {
          details: err.details.map((d) => ({
            param: d.path.join('.'),
            message: d.message,
          })),
        },
      },
      isOperational: true,
    };
  }

  if (err.isBoom && err.output) {
    return {
      response: {
        code: err.output.statusCode,
        message:
          err.output.payload.message || err.output.payload.error || 'Boom error',
      },
      isOperational: true,
    };
  }


  if (err instanceof BaseError) {
    return {
      response: {
        code: err.statusCode,
        message: err.message,
      },
      isOperational: err.isOperational,
    };
  }

  logger.error(`Critical Error Found: ${err.details}`);
  return {
    response: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    },
    isOperational: false,
  };
};
