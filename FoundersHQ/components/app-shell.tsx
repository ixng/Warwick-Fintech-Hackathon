"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { AppProvider } from "@/lib/app-context"
import type { ReactNode } from "react"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <SidebarNav />
        <main className="flex flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </AppProvider>
  )
}
