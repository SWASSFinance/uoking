"use client"

import { useMaintenanceMode } from '@/hooks/use-maintenance-mode'
import { MaintenanceOverlay } from './maintenance-overlay'
import { usePathname } from 'next/navigation'

interface MaintenanceProviderProps {
  children: React.ReactNode
}

export function MaintenanceProvider({ children }: MaintenanceProviderProps) {
  const { isEnabled, message, isLoading, error } = useMaintenanceMode()
  const pathname = usePathname()

  // Don't show maintenance overlay while loading or if there's an error
  if (isLoading || error) {
    return <>{children}</>
  }

  // Don't show maintenance overlay on admin pages
  const isAdminPage = pathname?.startsWith('/admin')
  
  return (
    <>
      {children}
      <MaintenanceOverlay isEnabled={isEnabled && !isAdminPage} message={message} />
    </>
  )
}
