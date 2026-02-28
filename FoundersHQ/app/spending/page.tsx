"use client"

import { TopBar } from "@/components/top-bar"
import { AnomalyDetector } from "@/components/spending/anomaly-detector"
import { TransactionTable } from "@/components/spending/transaction-table"
import { AddTransaction } from "@/components/spending/add-transaction"

export default function SpendingPage() {
  return (
    <>
      <TopBar title="Spending" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <AddTransaction />
              <AnomalyDetector />
            </div>
            <div className="lg:col-span-2">
              <TransactionTable />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
