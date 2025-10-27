import fs from 'fs';
import { TransformableInfo } from 'logform';
import { createLogger, format, Logger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import app from '../config/config';
import context from './context';

const { environment, logging } = app;
const { combine, colorize, splat, printf, timestamp, json } = format;

// Campos que devem ser mascarados nos logs
const keysToFilter = ['password', 'token'];

// Sanitiza os metadados, escondendo campos sensíveis
const sanitizeMeta = (meta: Record<string, unknown>) =>
  JSON.stringify(meta, (key, value) =>
    keysToFilter.includes(key) ? '******' : value,
  );

// Formato de logs para desenvolvimento (colorido e legível)
const devFormat = combine(
  colorize({ all: true }),
  splat(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf((info: TransformableInfo) => {
    const { level, message, timestamp: ts, ...rest } = info;
    const transactionId = context?.getStore()?.get('transactionId') || '-';
    const meta = Object.keys(rest).length > 0 ? sanitizeMeta(rest) : '';
    return `[${ts}] [${transactionId}] ${level}: ${message} ${meta}`;
  })
);

// Formato de logs para produção (JSON estruturado)
const prodFormat = combine(timestamp(), json());

// Garantir que a pasta de logs exista (se aplicável)
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Decide se logs em arquivo serão gerados
const logFileGenerationSupported = logging?.logFileGenarationSupport !== 'false';

// Define os transports dinamicamente conforme o ambiente e suporte
const baseTransports = [];

if (logFileGenerationSupported) {
  // Ambiente com suporte a arquivos
  if (environment === 'production') {
    baseTransports.push(
      new DailyRotateFile({
        dirname: 'logs',
        filename: `${logging.level || 'app'}-%DATE%.log`,
        zippedArchive: true,
        maxSize: logging.maxSize,
        maxFiles: logging.maxFiles,
        datePattern: logging.datePattern,
      })
    );
  } else {
    // Em desenvolvimento, também loga no console
    baseTransports.push(new transports.Console());
  }
} else {
  // Cloud environments como Heroku, apenas console
  baseTransports.push(new transports.Console());
}

// Cria o logger principal
const logger: Logger = createLogger({
  level: logging?.level || 'info',
  format: environment === 'development' ? devFormat : prodFormat,
  transports: baseTransports,
});

// Loga uma mensagem no início do modo dev (opcional)
if (environment === 'development') {
  console.log('✅ Logger initialized in development mode');
}

export default logger;
