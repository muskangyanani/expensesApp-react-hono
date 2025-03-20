import { createFileRoute } from '@tanstack/react-router'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  return (
    <div className="p-2 ">
      <h2>Create Expense</h2>
      <form action="" className="max-w-xl m-auto">
        <Label className="mt-2" htmlFor="title">
          Title
        </Label>
        <Input className="mt-2" type="text" id="title" placeholder="title" />
        <Label className="mt-2" htmlFor="amount">
          amount
        </Label>
        <Input
          className="mt-2"
          type="number"
          id="amount"
          placeholder="amount"
        />
        <Button className="mt-4" type="submit">
          Create Expense
        </Button>
      </form>
    </div>
  )
}
