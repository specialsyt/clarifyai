'use client'

import * as React from 'react'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarProvider>
  )
}
