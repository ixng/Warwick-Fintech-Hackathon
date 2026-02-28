"use client"

import { useAppState } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Database, Building } from "lucide-react"

export function TopBar({ title }: { title: string }) {
  const { state, dispatch } = useAppState()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {state.companyName}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: "LOAD_SAAS" })}
          className="gap-2 border-border bg-secondary text-secondary-foreground hover:bg-emerald/10 hover:text-emerald"
        >
          <Database className="h-3.5 w-3.5" />
          Load SaaS
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: "LOAD_AGENCY" })}
          className="gap-2 border-border bg-secondary text-secondary-foreground hover:bg-emerald/10 hover:text-emerald"
        >
          <Building className="h-3.5 w-3.5" />
          Load B2B Agency
        </Button>
      </div>
    </header>
  )
}
