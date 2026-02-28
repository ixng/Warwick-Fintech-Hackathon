"use client"

import { TopBar } from "@/components/top-bar"
import { StatCards } from "@/components/dashboard/stat-cards"
import { RunwayChart } from "@/components/dashboard/runway-chart"
import { ScenarioSimulator } from "@/components/dashboard/scenario-simulator"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <StatCards />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <RunwayChart />
            </div>
            <div className="lg:col-span-2">
              <ScenarioSimulator />
            </div>
          </div>
          <RecentActivity />
        </div>
      </div>
    </>
  )
}
