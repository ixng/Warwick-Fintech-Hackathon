"use client"

import { useAppState } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal } from "lucide-react"

export function ScenarioSimulator() {
  const { state, dispatch } = useAppState()

  const adjustedRevenue = state.scenarioRevenue
  const lateImpact = (state.scenarioLatePayments / 100) * adjustedRevenue
  const hiringCost = state.scenarioHiring * 8500
  const adjustedBurn = state.monthlyBurn + hiringCost
  const effectiveRevenue = adjustedRevenue - lateImpact
  const netBurn = adjustedBurn - effectiveRevenue
  const adjustedRunway = netBurn > 0
    ? (state.cashBalance / netBurn).toFixed(1)
    : "Infinite"

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald" />
          <CardTitle className="text-base font-semibold text-card-foreground">
            Scenario Simulator
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Revenue</span>
            <span className="text-sm font-semibold text-card-foreground">
              ${state.scenarioRevenue.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[state.scenarioRevenue]}
            min={0}
            max={Math.max(state.monthlyRevenue * 3, 300000)}
            step={5000}
            onValueChange={([v]) =>
              dispatch({ type: "SET_SCENARIO", payload: { field: "scenarioRevenue", value: v } })
            }
            className="[&_[role=slider]]:bg-emerald [&_[role=slider]]:border-emerald [&>.bg-primary]:bg-emerald"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Late Payment Risk</span>
            <span className="text-sm font-semibold text-card-foreground">
              {state.scenarioLatePayments}%
            </span>
          </div>
          <Slider
            value={[state.scenarioLatePayments]}
            min={0}
            max={80}
            step={5}
            onValueChange={([v]) =>
              dispatch({ type: "SET_SCENARIO", payload: { field: "scenarioLatePayments", value: v } })
            }
            className="[&_[role=slider]]:bg-warning [&_[role=slider]]:border-warning [&>.bg-primary]:bg-warning"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New Hires</span>
            <span className="text-sm font-semibold text-card-foreground">
              +{state.scenarioHiring} ({state.scenarioHiring > 0 ? `+$${(state.scenarioHiring * 8500).toLocaleString()}/mo` : "$0/mo"})
            </span>
          </div>
          <Slider
            value={[state.scenarioHiring]}
            min={0}
            max={10}
            step={1}
            onValueChange={([v]) =>
              dispatch({ type: "SET_SCENARIO", payload: { field: "scenarioHiring", value: v } })
            }
            className="[&_[role=slider]]:bg-chart-2 [&_[role=slider]]:border-chart-2 [&>.bg-primary]:bg-chart-2"
          />
        </div>

        <div className="rounded-lg border border-border bg-secondary p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Adjusted Runway</p>
              <p className="text-xl font-bold text-emerald">{adjustedRunway} mo</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Monthly Burn</p>
              <p className={`text-xl font-bold ${netBurn > 0 ? "text-chart-5" : "text-emerald"}`}>
                {netBurn > 0 ? `-$${netBurn.toLocaleString()}` : `+$${Math.abs(netBurn).toLocaleString()}`}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Late Payment Impact</p>
              <p className="text-sm font-semibold text-warning">-${Math.round(lateImpact).toLocaleString()}/mo</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hiring Cost</p>
              <p className="text-sm font-semibold text-chart-2">+${hiringCost.toLocaleString()}/mo</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
