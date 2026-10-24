import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
  DATABASE_URL: z.string().url(),
  DIRECT_DATABASE_URL: z.string().url().optional(),
  DATABASE_SSL: z.enum(['true', 'false']).default('true'),
  FIREBASE_PROJECT_ID: z.string().min(1),
  CORS_ALLOWED_ORIGINS: z.string().min(1).default('http://localhost:5173'),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const invalidNames = [
    ...new Set(parsedEnvironment.error.issues.map((issue) => String(issue.path[0]))),
  ];
  console.error(`Invalid server environment variables: ${invalidNames.join(', ')}`);
  process.exit(1);
}

const values = parsedEnvironment.data;
const allowedOrigins = values.CORS_ALLOWED_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.includes('*')) {
  console.error('CORS_ALLOWED_ORIGINS must list explicit origins.');
  process.exit(1);
}

if (values.NODE_ENV === 'production' && values.DATABASE_SSL !== 'true') {
  console.error('DATABASE_SSL must be true in production.');
  process.exit(1);
}

export const config = {
  nodeEnv: values.NODE_ENV,
  port: values.PORT,
  databaseUrl: values.DATABASE_URL,
  directDatabaseUrl: values.DIRECT_DATABASE_URL,
  databaseSsl: values.DATABASE_SSL === 'true',
  firebaseProjectId: values.FIREBASE_PROJECT_ID,
  allowedOrigins: new Set(allowedOrigins),
} as const;
