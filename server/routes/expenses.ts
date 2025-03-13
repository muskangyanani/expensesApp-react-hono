import { Hono } from 'hono'
import { number, z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const expenseSchema = z.object({
  id: number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })

const fakeExpenses: Expense[] = [
  { id: 1, title: 'Groceries', amount: 50 },
  { id: 2, title: 'Utilities', amount: 100 },
  { id: 3, title: 'Rent', amount: 500 },
]

export const expensesRoute = new Hono()
  .get('/', (c) => {
    return c.json(fakeExpenses)
  })
  .post('/', zValidator('json', createPostSchema), async (c) => {
    const data = await c.req.valid('json')
    const expense = createPostSchema.parse(data)
    fakeExpenses.push({ id: fakeExpenses.length + 1, ...expense })
    return c.json(expense)
  })
  .get('/:id{[0-9]+}', async (c) => {
    const expense = fakeExpenses.find(
      (expense) => expense.id === Number.parseInt(c.req.param('id')),
    )
    if (!expense) return c.notFound()
    return c.json({ expense })
  })
  .delete('/:id{[0-9]+}', async (c) => {
    const id = Number.parseInt(c.req.param('id'))
    const index = fakeExpenses.findIndex((expense) => expense.id === id)
    if (index === -1) return c.notFound()
    const deletedExpense = fakeExpenses.splice(index, 1)[0]
    return c.json({ message: `expense with id ${id} is deleted` })
  })
// .put
