// import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
// import { migrate } from 'drizzle-orm/postgres-js/migrator';
// import { resolve } from 'node:path';
// import { dirname } from 'path';
// import postgres from 'postgres';
// import { fileURLToPath } from 'url';

// const __dirname = dirname(fileURLToPath(import.meta.url));

// export async function migrateLatest() {
//   console.log('Running migrations...');
//   const dbUrl: string = process.env.DATABASE_URL || '';
//   const client = postgres(dbUrl, { max: 1 });

//   const db: PostgresJsDatabase = drizzle(client);
//   const dbDir = resolve(__dirname, 'src', 'db', 'migrations');
//   await migrate(db, {
//     migrationsFolder: dbDir,
//   });
//   console.log('Migrations completed successfully');
// }

import { migrateLatest } from '../src/db';

migrateLatest();
