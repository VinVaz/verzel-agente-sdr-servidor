import BaseError from "../../exceptions/BaseError";

export const isOperationalError = (err: unknown, code?: number): boolean => {
  if (err instanceof BaseError) return err.isOperational;
  if (typeof code === 'number') return code < 500;
  return false;
};
