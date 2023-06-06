/** @type {import('next').NextConfig} */

const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { resolve } = require('node:path');

const { Client } = require('pg');


const nextConfig = {}

module.exports = async (phase) => {
  if(phase === 'phase-production-build') {
    return nextConfig;
  }

  if (
    phase === 'phase-production-server' &&
    process.env.ENVIRONMENT === 'production'
  ) {
    console.log(`Retrieving secrets from AWS SSM Parameter Store...`);
    // TODO: Get secrets code
    console.log(`Successfully updated process.env with secrets`);
  }

  console.log('Running migrations...');
  await migrateLatest()
  console.log('Migrations completed successfully');

  return nextConfig;
};

async function migrateLatest() {
  console.log('Running migrations...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect()
  const db = drizzle(client)
  await migrate(db, { migrationsFolder: resolve(__dirname, 'src', 'db', 'migrations') });
  console.log('Migrations completed successfully');
  client.end();
}
