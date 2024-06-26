import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema/index.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
