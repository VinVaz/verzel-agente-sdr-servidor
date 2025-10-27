import { StatusCodes } from 'http-status-codes';


class BaseError extends Error {
  public readonly name: string
  public readonly message: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    name = 'Error',
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    message: string,
    isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.message = message
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export default BaseError
