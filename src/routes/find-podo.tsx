import { createFileRoute } from '@tanstack/react-router'
import { FindPodo } from '../pages/FindPodo'

export const Route = createFileRoute('/find-podo')({
  component: FindPodo,
})
