import { app } from './app.ts';
import { config } from './config.ts';
import { database } from './database.ts';

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`API listening on port ${config.port}`);
});

const shutdown = (): void => {
  server.close(() => {
    void database.end().finally(() => process.exit(0));
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
