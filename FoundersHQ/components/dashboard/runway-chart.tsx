"use client"

import { useAppState } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Gauge } from "lucide-react"

export function RunwayChart() {
  const { state } = useAppState()

  const runwayMonths = state.monthlyBurn > state.monthlyRevenue
    ? (state.cashBalance / (state.monthlyBurn - state.monthlyRevenue)).toFixed(1)
    : "Infinite"

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-emerald" />
            <CardTitle className="text-base font-semibold text-card-foreground">
              12-Week Runway Forecast
            </CardTitle>
          </div>
          <span className="rounded-md bg-emerald/10 px-2.5 py-1 text-xs font-bold text-emerald">
            {runwayMonths} months
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={state.runwayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="week" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
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
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Area
                type="monotone"
                dataKey="cashBalance"
                stroke="#10B981"
                fill="url(#cashGradient)"
                strokeWidth={2}
                name="Cash Balance"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fill="none"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="burn"
                stroke="#EF4444"
                fill="none"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                name="Burn"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald" />
            <span className="text-xs text-muted-foreground">Cash Balance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-chart-5" />
            <span className="text-xs text-muted-foreground">Burn</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
