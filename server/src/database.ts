import { Pool } from 'pg';
import { config } from './config.ts';

const removeUrlSslOptions = (connectionString: string): string => {
  const connectionUrl = new URL(connectionString);
  for (const option of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) {
    connectionUrl.searchParams.delete(option);
  }
  return connectionUrl.toString();
};

export const createDatabasePool = (connectionString: string): Pool => new Pool({
  connectionString: removeUrlSslOptions(connectionString),
  ssl: config.databaseSsl ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const database = createDatabasePool(config.databaseUrl);
