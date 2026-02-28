"use client"

import { useAppState } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard } from "lucide-react"

const statusStyles: Record<string, string> = {
  cleared: "bg-emerald/10 text-emerald border-emerald/20",
  pending: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  quarantined: "bg-chart-5/10 text-chart-5 border-chart-5/20",
}

export function TransactionTable() {
  const { state } = useAppState()
  const sorted = [...state.transactions].reverse()

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-emerald" />
          <CardTitle className="text-base font-semibold text-card-foreground">
            All Transactions
          </CardTitle>
          <span className="text-xs text-muted-foreground">({sorted.length})</span>
        </div>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No transactions yet. Load sample data or add a transaction.
          </p>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Vendor</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((tx) => (
                  <TableRow key={tx.id} className="border-border">
                    <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="text-sm font-medium text-card-foreground">{tx.vendor}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.category}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-card-foreground tabular-nums">
                      ${tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[tx.status]}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
