"use client"

import { useAppState } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

const statusStyles: Record<string, string> = {
  cleared: "bg-emerald/10 text-emerald border-emerald/20",
  pending: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  quarantined: "bg-chart-5/10 text-chart-5 border-chart-5/20",
}

export function RecentActivity() {
  const { state } = useAppState()
  const recent = [...state.transactions].reverse().slice(0, 6)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald" />
          <CardTitle className="text-base font-semibold text-card-foreground">Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Load sample data to see recent transactions
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{tx.vendor}</p>
                  <p className="text-xs text-muted-foreground">{tx.date} &middot; {tx.category}</p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className="text-sm font-semibold text-card-foreground tabular-nums">
                    ${tx.amount.toLocaleString()}
                  </span>
                  <Badge variant="outline" className={statusStyles[tx.status]}>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
