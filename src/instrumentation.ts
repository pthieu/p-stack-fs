import { migrateLatest } from '~/app/api/db';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { migrate } from 'drizzle-orm/node-postgres/migrator';
// import { resolve } from 'node:path';
// import { Client } from 'pg';

// async function migrateLatest() {
//   console.log('Running migrations...');
//   console.log();
//   console.log(process.env.DATABASE_URL);

//   const client = new Client({
//     connectionString: process.env.DATABASE_URL,
//   });

//   await client.connect();
//   const db = drizzle(client);
//   await migrate(db, {
//     migrationsFolder: resolve('db', 'migrations'),
//   });
//   console.log('Migrations completed successfully');
//   client.end();
// }

export async function register() {
  await migrateLatest();
}
