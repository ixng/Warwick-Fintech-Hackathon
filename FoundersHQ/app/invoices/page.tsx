"use client"

import { TopBar } from "@/components/top-bar"
import { InvoiceControlTower } from "@/components/invoices/invoice-control-tower"
import { InvoiceStats } from "@/components/invoices/invoice-stats"

export default function InvoicesPage() {
  return (
    <>
      <TopBar title="Invoices" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <InvoiceStats />
          <InvoiceControlTower />
        </div>
      </div>
    </>
  )
}
