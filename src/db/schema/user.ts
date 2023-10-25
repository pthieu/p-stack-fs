import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const tableName = 'users';

export const UserTable = pgTable(
  tableName,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 512 }).unique().notNull(),
    clerkId: varchar('clerk_id', { length: 256 }).unique().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex(`${tableName}_email_idx`).on(table.email),
    };
  },
);

export const users = UserTable;

export type User = typeof UserTable.$inferSelect;
export type NewUser = typeof UserTable.$inferInsert;
