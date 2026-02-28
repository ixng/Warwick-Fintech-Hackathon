"use client"

import { useAppState } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

export function StatCards() {
  const { state } = useAppState()

  const quarantined = state.transactions.filter((t) => t.status === "quarantined").length
  const runwayMonths = state.monthlyBurn > 0
    ? Math.round((state.cashBalance / (state.monthlyBurn - state.monthlyRevenue)) * 10) / 10
    : Infinity
  const netBurn = state.monthlyBurn - state.monthlyRevenue

  const stats = [
    {
      label: "Cash Balance",
      value: `$${state.cashBalance.toLocaleString()}`,
      icon: DollarSign,
      change: null,
      accent: "text-emerald",
      bg: "bg-emerald/10",
    },
    {
      label: "Monthly Revenue",
      value: `$${state.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      change: "+12% MoM",
      accent: "text-emerald",
      bg: "bg-emerald/10",
    },
    {
      label: "Net Burn",
      value: netBurn > 0 ? `-$${netBurn.toLocaleString()}` : `+$${Math.abs(netBurn).toLocaleString()}`,
      icon: TrendingDown,
      change: null,
      accent: netBurn > 0 ? "text-chart-5" : "text-emerald",
      bg: netBurn > 0 ? "bg-chart-5/10" : "bg-emerald/10",
    },
    {
      label: "Quarantined",
      value: quarantined.toString(),
      icon: AlertTriangle,
      change: quarantined > 0 ? "Requires review" : "All clear",
      accent: quarantined > 0 ? "text-warning" : "text-emerald",
      bg: quarantined > 0 ? "bg-warning/10" : "bg-emerald/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                <s.icon className={`h-4 w-4 ${s.accent}`} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{s.value}</p>
            {s.change && (
              <p className={`mt-1 text-xs font-medium ${s.accent}`}>{s.change}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
