import { eq } from 'drizzle-orm';

import { createOrGetDb } from '~/db';
import { NewUser, UserTable } from '~/db/schema';

const Table = UserTable;

const db = createOrGetDb();

export function create(data: NewUser) {
  const query = db.insert(Table).values(data).returning();
  return query;
}

export function updateById(id: string, data: Partial<NewUser>) {
  const query = db
    .update(Table)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(Table.id, id));
  return query;
}

export async function getById(id: string) {
  const rows = await db.select().from(Table).where(eq(Table.id, id));
  if (rows.length > 0) {
    return rows[0];
  }
}

export async function getByAuthId(id: string) {
  const rows = await db.select().from(Table).where(eq(Table.clerkId, id));
  if (rows.length > 0) {
    return rows[0];
  }
}
