import chalk from 'chalk';
import * as dotenv from 'dotenv';
import Joi from 'joi';

import errors from '../resources/lang/errors.json';
import messages from '../resources/lang/messages.json';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  SERVER_URL: Joi.string().uri().required(),
  APP_PORT: Joi.number().integer().min(1).max(65535),
  TEST_APP_PORT: Joi.number().integer().min(1).max(65535),

  CLIENT_URL: Joi.string().uri().required(),

  LOGGING_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  LOGGING_MAX_SIZE: Joi.string().default('20m'),
  LOGGING_MAX_FILES: Joi.string().default('7d'),
  LOGGING_DATE_PATTERN: Joi.string().default('YYYY-MM-DD'),
  LOG_FILE_GENERATION_SUPPORT: Joi.boolean().truthy('true').falsy('false').default(true),

  DB_CLIENT: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().integer().default(5432),
  DB_NAME: Joi.string().required(),
  TEST_DB_NAME: Joi.string(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),

  npm_package_name: Joi.string().optional(),
  npm_package_version: Joi.string().optional(),
}).unknown(true);

const { error, value: env } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
});

if (error) {
  console.error(chalk.red.bold('\n❌ Environment variables validation error:\n'));
  error.details.forEach((detail) => {
    console.error(chalk.yellow(`- ${detail.message}`));
  });
  console.log();
  process.exit(1);
}

const isTestEnvironment = env.NODE_ENV === 'development';

export default {
  errors,
  messages,
  name: env.npm_package_name,
  version: env.npm_package_version,
  serverUrl: env.SERVER_URL,
  clientUrl: env.CLIENT_URL,
  environment: env.NODE_ENV,
  port: isTestEnvironment ? env.TEST_APP_PORT : env.APP_PORT,
  pagination: {
    page: 1,
    maxRows: 20,
  },
  logging: {
    level: env.LOGGING_LEVEL,
    maxSize: env.LOGGING_MAX_SIZE,
    maxFiles: env.LOGGING_MAX_FILES,
    datePattern: env.LOGGING_DATE_PATTERN,
    logFileGenarationSupport: env.LOG_FILE_GENERATION_SUPPORT,
  },
  db: {
    client: env.DB_CLIENT,
    connection: {
      charset: 'utf8',
      timezone: 'UTC',
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: isTestEnvironment ? env.TEST_DB_NAME : env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    },
  },
};