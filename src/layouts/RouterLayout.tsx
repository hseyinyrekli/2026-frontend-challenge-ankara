import { Outlet } from '@tanstack/react-router'
import { MainLayout } from './MainLayout'

export function RouterLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
