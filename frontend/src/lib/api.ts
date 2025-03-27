import { hc } from 'hono/client'
import { type ApiRoutes } from '@server/app'
import { queryOptions } from '@tanstack/react-query'
const client = hc<ApiRoutes>('/')

export const api = client.api
async function getCurrentUser() {
  const res = await api.me.$get()
  if (!res.ok) {
    throw new Error('Server Error')
  }
  const data = res.json()
  return data
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-curret-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
})
