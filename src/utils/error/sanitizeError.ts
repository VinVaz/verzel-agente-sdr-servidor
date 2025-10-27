const keysToFilter = ['password', 'token', 'authorization'];

const sanitizeError = (err: unknown): string => {
  if (typeof err === 'object' && err !== null) {
    return JSON.stringify(
      err,
      (key, value) =>
        keysToFilter.includes(key.toLowerCase()) ? '******' : value
    );
  }
  return String(err);
};

export default sanitizeError;
