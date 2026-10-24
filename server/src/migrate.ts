import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { QueryResultRow } from 'pg';
import { config } from './config.ts';
import { createDatabasePool } from './database.ts';

interface MigrationRecord extends QueryResultRow {
  checksum: string;
}

const migrationsDirectory = fileURLToPath(new URL('../migrations/', import.meta.url));
const advisoryLockKey = 7_412_026;

const runMigrations = async (): Promise<void> => {
  if (!config.directDatabaseUrl) {
    throw new Error('DIRECT_DATABASE_URL is required to run database migrations.');
  }

  const migrationDatabase = createDatabasePool(config.directDatabaseUrl);
  const client = await migrationDatabase.connect();
  let lockAcquired = false;
  try {
    await client.query('SELECT pg_advisory_lock($1)', [advisoryLockKey]);
    lockAcquired = true;
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_migrations (
        migration_name TEXT PRIMARY KEY,
        checksum TEXT NOT NULL,
        applied_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const files = (await readdir(migrationsDirectory))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const sql = await readFile(new URL(`../migrations/${file}`, import.meta.url), 'utf8');
      const checksum = createHash('sha256').update(sql).digest('hex');
      const recorded = await client.query<MigrationRecord>(
        'SELECT checksum FROM app_migrations WHERE migration_name = $1',
        [file],
      );

      if (recorded.rows[0]) {
        if (recorded.rows[0].checksum !== checksum) {
          throw new Error(`Migration checksum mismatch: ${file}`);
        }
        continue;
      }

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO app_migrations (migration_name, checksum) VALUES ($1, $2)',
          [file, checksum],
        );
        await client.query('COMMIT');
        console.log(`Applied database migration ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    try {
      if (lockAcquired) {
        await client.query('SELECT pg_advisory_unlock($1)', [advisoryLockKey]);
      }
    } finally {
      client.release();
      await migrationDatabase.end();
    }
  }
};

void runMigrations().catch(() => {
  console.error('Database migration failed. Check the database URL, TLS settings, and migration SQL.');
  process.exitCode = 1;
});
