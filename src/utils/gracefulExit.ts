import { HttpTerminator } from 'http-terminator';

import logger from '../utils/logger';

const gracefulExit = async (terminator: HttpTerminator, code = 0) => {
  try {
    logger.info('Shutting down server gracefully...');
    await terminator.terminate();
    logger.info('✅ Server terminated cleanly.');
  } catch (err) {
    logger.error('Error during graceful shutdown:', err);
  } finally {
    process.exit(code);
  }
};

export default gracefulExit