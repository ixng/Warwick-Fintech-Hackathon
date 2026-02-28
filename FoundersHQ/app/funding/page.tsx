"use client"

import { useAppState } from "@/lib/app-context"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Users, DollarSign, CheckCircle2, AlertTriangle } from "lucide-react"

function getFundingReadiness(state: {
  monthlyRevenue: number
  monthlyBurn: number
  cashBalance: number
}) {
  const scores: { label: string; score: number; max: number; detail: string }[] = []

  // MRR Score
  const mrrScore = Math.min(100, (state.monthlyRevenue / 100000) * 100)
  scores.push({
    label: "Monthly Revenue",
    score: Math.round(mrrScore),
    max: 100,
    detail: state.monthlyRevenue > 50000 ? "Strong MRR for seed/Series A" : "Build to $50k+ MRR for institutional interest",
  })

  // Burn multiple
  const burnMultiple = state.monthlyRevenue > 0 ? state.monthlyBurn / state.monthlyRevenue : 99
  const burnScore = Math.max(0, 100 - burnMultiple * 30)
  scores.push({
    label: "Burn Efficiency",
    score: Math.round(Math.min(100, burnScore)),
    max: 100,
    detail: burnMultiple < 2 ? "Efficient burn rate" : "Consider reducing burn to improve efficiency",
  })

  // Runway
  const netBurn = state.monthlyBurn - state.monthlyRevenue
  const runway = netBurn > 0 ? state.cashBalance / netBurn : 24
  const runwayScore = Math.min(100, (runway / 18) * 100)
  scores.push({
    label: "Runway Health",
    score: Math.round(runwayScore),
    max: 100,
    detail: runway > 12 ? "Healthy runway for fundraising" : "Consider extending runway before raising",
  })

  // Growth indicator
  const growthScore = state.monthlyRevenue > 0 ? Math.min(100, 70) : 0
  scores.push({
    label: "Growth Signal",
    score: growthScore,
    max: 100,
    detail: state.monthlyRevenue > 0 ? "Positive revenue trajectory" : "Revenue needed to signal growth",
  })

  const overall = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
  return { scores, overall }
}

const fundingStages = [
  {
    stage: "Pre-Seed",
    range: "$250K - $1M",
    requirements: "MVP, early traction, founding team",
    icon: Target,
  },
  {
    stage: "Seed",
    range: "$1M - $4M",
    requirements: "$10K+ MRR, product-market fit signals",
    icon: Users,
  },
  {
    stage: "Series A",
    range: "$5M - $15M",
    requirements: "$50K+ MRR, clear growth metrics, unit economics",
    icon: TrendingUp,
  },
  {
    stage: "Series B",
    range: "$15M - $50M",
    requirements: "$200K+ MRR, proven scalability, market leadership",
    icon: DollarSign,
  },
]

export default function FundingPage() {
  const { state } = useAppState()
  const { scores, overall } = getFundingReadiness(state)

  const currentStage =
    state.monthlyRevenue >= 200000 ? "Series B" :
    state.monthlyRevenue >= 50000 ? "Series A" :
    state.monthlyRevenue >= 10000 ? "Seed" : "Pre-Seed"

  return (
    <>
      <TopBar title="Funding Fit" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Overall Score */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald/30">
                  <span className="text-3xl font-bold text-emerald">{overall}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">Funding Readiness Score</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {overall >= 75 ? "Strong position for fundraising" :
                     overall >= 50 ? "Building momentum - continue optimizing key metrics" :
                     "Early stage - focus on growth and efficiency"}
                  </p>
                  <Badge variant="outline" className="mt-2 bg-emerald/10 text-emerald border-emerald/20">
                    Best fit: {currentStage}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score breakdown */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {scores.map((s) => (
              <Card key={s.label} className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">{s.label}</span>
                    <span className={`text-sm font-bold ${s.score >= 70 ? "text-emerald" : s.score >= 40 ? "text-warning" : "text-chart-5"}`}>
                      {s.score}/100
                    </span>
                  </div>
                  <Progress
                    value={s.score}
                    className="h-2 bg-secondary [&>div]:bg-emerald"
                  />
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                    {s.score >= 60 ? (
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                    )}
                    {s.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Funding stages */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">Funding Stage Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {fundingStages.map((fs) => {
                  const isCurrent = fs.stage === currentStage
                  return (
                    <div
                      key={fs.stage}
                      className={`rounded-lg border p-4 transition-colors ${
                        isCurrent ? "border-emerald/50 bg-emerald/5" : "border-border bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <fs.icon className={`h-4 w-4 ${isCurrent ? "text-emerald" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-semibold ${isCurrent ? "text-emerald" : "text-card-foreground"}`}>
                          {fs.stage}
                        </span>
                        {isCurrent && (
                          <Badge variant="outline" className="bg-emerald/10 text-emerald border-emerald/20 text-[10px] px-1.5 py-0">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg font-bold text-card-foreground">{fs.range}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{fs.requirements}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
