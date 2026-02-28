"use client"

import { useAppState } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function InvoiceStats() {
  const { state } = useAppState()

  const byClient = state.invoices.map((inv) => ({
    name: inv.client.length > 12 ? inv.client.substring(0, 12) + "..." : inv.client,
    amount: inv.amount,
    lateDays: inv.avgLateDays,
    status: inv.status,
  }))

  const getBarColor = (status: string) => {
    switch (status) {
      case "paid": return "#10B981"
      case "overdue": return "#EF4444"
      default: return "#3B82F6"
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <p className="mb-3 text-sm font-semibold text-card-foreground">Invoice Amounts by Client</p>
        {byClient.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Load sample data to see chart</p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byClient} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #1E293B",
                    borderRadius: "8px",
                    color: "#E2E8F0",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {byClient.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
