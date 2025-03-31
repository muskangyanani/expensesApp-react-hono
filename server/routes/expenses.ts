import { Hono } from 'hono'
import { number, z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { getUser } from '../kinde'

import { db } from '../db'
import { expenses as expensesTable } from '../db/schema/expenses'
import { eq } from 'drizzle-orm'

const expenseSchema = z.object({
  id: number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.string(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })

const fakeExpenses: Expense[] = [
  { id: 1, title: 'Groceries', amount: '50' },
  { id: 2, title: 'Utilities', amount: '100' },
  { id: 3, title: 'Rent', amount: '500' },
]

export const expensesRoute = new Hono()
  .get('/', getUser, async (c) => {
    const user = c.var.user
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
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
    // await new Promise((r) => setTimeout(r, 2000))
    const total = fakeExpenses.reduce(
      (total, expense) => total + +expense.amount,
      0,
    )
    return c.json({ total })
  })
  .get('/:id{[0-9]+}', getUser, async (c) => {
    const expense = fakeExpenses.find(
      (expense) => expense.id === Number.parseInt(c.req.param('id')),
    )
    if (!expense) return c.notFound()
    return c.json({ expense })
  })
  .delete('/:id{[0-9]+}', getUser, async (c) => {
    const id = Number.parseInt(c.req.param('id'))
    const index = fakeExpenses.findIndex((expense) => expense.id === id)
    if (index === -1) return c.notFound()
    const deletedExpense = fakeExpenses.splice(index, 1)[0]
    return c.json({ message: `expense with id ${id} is deleted` })
  })
// .put
