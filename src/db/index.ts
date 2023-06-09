// import { Pool } from 'pg';

import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { resolve } from 'node:path';
import { dirname } from 'path';
import postgres from 'postgres';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// let db: ReturnType<typeof drizzle>;
let db: PostgresJsDatabase;
export async function createDb() {
  if (db) {
    return db;
  }
  const dbUrl: string = process.env.DATABASE_URL || '';
  const client = postgres(dbUrl);

  db = drizzle(client);
  return db;
}

export async function migrateLatest() {
  console.log('Running migrations...');
  const db = await createDb();
  const dbDir = resolve(__dirname, 'migrations');
  await migrate(db, {
    migrationsFolder: dbDir,
  });
  console.log('Migrations completed successfully');
}
