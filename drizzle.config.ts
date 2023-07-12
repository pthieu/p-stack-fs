import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/*',
  out: './src/db/migrations',
  dbCredentials: {
    connectionString: 'DATABASE_URL',
  },
} satisfies Config;
