import {
  serial,
  text,
  pgSchema,
  pgTable,
  numeric,
  index,
} from 'drizzle-orm/pg-core'

export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  },
  (expenses) => {
    return {
      userIdIndex: index('user_id_index').on(expenses.userId),
    }
  },
)
