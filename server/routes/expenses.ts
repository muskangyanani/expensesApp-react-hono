import { Hono } from 'hono'
import { number, z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { getUser } from '../kinde'

import { db } from '../db'
import { expenses as expensesTable } from '../db/schema/expenses'
import { eq, desc, sum, and } from 'drizzle-orm'

const expenseSchema = z.object({
  id: number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.string(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })

export const expensesRoute = new Hono()
  .get('/', getUser, async (c) => {
    const user = c.var.user
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100)
    return c.json({ expenses: expenses })
  })
  .post('/', getUser, zValidator('json', createPostSchema), async (c) => {
    const expense = await c.req.valid('json')
    const user = c.var.user
    const result = await db
      .insert(expensesTable)
      .values({
        ...expense,
        userId: user.id,
      })
      .returning()
    return c.json(result)
  })
  .get('/total-spent', getUser, async (c) => {
    const user = c.var.user
    const result = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then((result) => result[0])
    return c.json(result)
  })
  .get('/:id{[0-9]+}', getUser, async (c) => {
    const id = Number.parseInt(c.req.param('id'))
    const user = c.var.user
    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .orderBy(desc(expensesTable.createdAt))
      .then((result) => result[0])
    return c.json({ expense })
  })
  .delete('/:id{[0-9]+}', getUser, async (c) => {
    const id = Number.parseInt(c.req.param('id'))
    const user = c.var.user
    const result = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .returning()
      .then((result) => result[0])
    if (!result) return c.notFound()
    return c.json({ message: `expense with id ${id} is deleted` })
  })
