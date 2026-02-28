"use client"

import { useAppState } from "@/lib/app-context"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RunwayChart } from "@/components/dashboard/runway-chart"
import { ScenarioSimulator } from "@/components/dashboard/scenario-simulator"
import { Gauge, TrendingDown, DollarSign, Calendar } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

export default function RunwayPage() {
  const { state } = useAppState()

  const netBurn = state.monthlyBurn - state.monthlyRevenue
  const runwayMonths = netBurn > 0 ? (state.cashBalance / netBurn).toFixed(1) : "Infinite"
  const zeroDate = netBurn > 0
    ? new Date(Date.now() + (state.cashBalance / netBurn) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "N/A"

  const weeklyBurnData = state.runwayData.map((w) => ({
    week: w.week,
    burn: w.burn,
    revenue: w.revenue,
  }))

  return (
    <>
      <TopBar title="Runway Radar" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Runway</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10">
                    <Gauge className="h-4 w-4 text-emerald" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{runwayMonths} months</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Monthly Burn Rate</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-5/10">
                    <TrendingDown className="h-4 w-4 text-chart-5" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">${state.monthlyBurn.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10">
                    <DollarSign className="h-4 w-4 text-emerald" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">${state.cashBalance.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Zero Cash Date</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                    <Calendar className="h-4 w-4 text-warning" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{zeroDate}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <RunwayChart />
            </div>
            <div className="lg:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-card-foreground">
                    Weekly Burn vs Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyBurnData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                        <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} name="Revenue" />
                        <Bar dataKey="burn" fill="#EF4444" radius={[4, 4, 0, 0]} name="Burn" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <ScenarioSimulator />
        </div>
      </div>
    </>
  )
}
