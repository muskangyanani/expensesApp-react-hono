import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'
import { useForm } from '@tanstack/react-form'
import { api } from '../../lib/api'

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Form Data:', value)

      const res = await api.expenses.$post({
        json: { ...value, amount: value.amount },
      })
      if (!res.ok) {
        throw new Error('Failed to create expense')
      }
      navigate({ to: '/expenses' })
    },
  })

  return (
    <div className="p-4 w-2xl mx-auto">
      <h2 className="text-xl font-bold">Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Title Field */}
        <form.Field name="title">
          {(field) => (
            <div className="mt-2 flex flex-col gap-2">
              <Label htmlFor={field.name}>Title</Label>
              <Input
                type="text"
                id={field.name}
                placeholder="Enter title"
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
              />
              {field.state.meta.errors && (
                <p className="text-red-500 text-sm">
                  {field.state.meta.errors}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Amount Field */}
        <form.Field
          name="amount"
          validators={{
            onChange: ({ value }) => {
              const numValue = Number(value)

              return !numValue || isNaN(numValue) || numValue <= 0
                ? 'Amount must be a positive number'
                : undefined
            },
          }}
        >
          {(field) => (
            <div className="mt-2 flex flex-col gap-2">
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                type="number"
                id={field.name}
                placeholder="Enter amount"
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
              />
              {field.state.meta.errors && (
                <p className="text-red-500 text-sm">
                  {field.state.meta.errors}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Submit Button */}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
