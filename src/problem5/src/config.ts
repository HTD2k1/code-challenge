import dotenv from 'dotenv';
import path from 'path';

// Load development environment file
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `env.${nodeEnv}`;

// Load environment variables from the appropriate file
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Fallback to .env if the specific env file doesn't exist
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  dbPath: process.env.DB_PATH || './database.sqlite',
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || true,
  logLevel: process.env.LOG_LEVEL || 'info',
  dbLogging: process.env.DB_LOGGING === 'true',
};
