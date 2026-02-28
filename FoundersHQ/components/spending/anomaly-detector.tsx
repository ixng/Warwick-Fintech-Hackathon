"use client"

import { useAppState } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Check, X } from "lucide-react"

export function AnomalyDetector() {
  const { state, dispatch } = useAppState()
  const quarantined = state.transactions.filter((t) => t.status === "quarantined")

  return (
    <Card className="border-chart-5/30 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-chart-5" />
            <CardTitle className="text-base font-semibold text-card-foreground">
              Anomaly Detector
            </CardTitle>
          </div>
          <Badge variant="outline" className={quarantined.length > 0 ? "bg-chart-5/10 text-chart-5 border-chart-5/20" : "bg-emerald/10 text-emerald border-emerald/20"}>
            {quarantined.length > 0 ? `${quarantined.length} quarantined` : "All clear"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {quarantined.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10">
              <Check className="h-6 w-6 text-emerald" />
            </div>
            <p className="mt-3 text-sm font-medium text-card-foreground">No anomalies detected</p>
            <p className="mt-1 text-xs text-muted-foreground">All transactions passed the firewall</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quarantined.map((tx) => (
              <div
                key={tx.id}
                className="rounded-lg border border-chart-5/20 bg-chart-5/5 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{tx.vendor}</p>
                    <p className="text-xs text-muted-foreground">{tx.date} &middot; {tx.category}</p>
                    <p className="mt-1 text-lg font-bold text-chart-5">${tx.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dispatch({ type: "APPROVE_TRANSACTION", payload: tx.id })}
                      className="h-8 gap-1 border-emerald/30 text-emerald hover:bg-emerald/10"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dispatch({ type: "REJECT_TRANSACTION", payload: tx.id })}
                      className="h-8 gap-1 border-chart-5/30 text-chart-5 hover:bg-chart-5/10"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>
                {tx.quarantineReason && (
                  <p className="mt-2 rounded-md bg-card p-2 text-xs text-warning">
                    Reason: {tx.quarantineReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
