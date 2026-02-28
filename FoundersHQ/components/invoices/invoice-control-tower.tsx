"use client"

import { useAppState } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText } from "lucide-react"

const statusStyles: Record<string, string> = {
  paid: "bg-emerald/10 text-emerald border-emerald/20",
  outstanding: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  overdue: "bg-chart-5/10 text-chart-5 border-chart-5/20",
}

export function InvoiceControlTower() {
  const { state } = useAppState()

  const totalOutstanding = state.invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const avgLateDays = state.invoices.length > 0
    ? Math.round(state.invoices.reduce((sum, inv) => sum + inv.avgLateDays, 0) / state.invoices.length)
    : 0

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald" />
            <CardTitle className="text-base font-semibold text-card-foreground">
              Invoice Control Tower
            </CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="text-sm font-bold text-warning">${totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Avg. Late</p>
              <p className="text-sm font-bold text-chart-5">{avgLateDays} days</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {state.invoices.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Load sample data to see invoices
          </p>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Client</TableHead>
                  <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Due Date</TableHead>
                  <TableHead className="text-muted-foreground">Predicted Pay</TableHead>
                  <TableHead className="text-right text-muted-foreground">Avg. Late</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.invoices.map((inv) => (
                  <TableRow key={inv.id} className="border-border">
                    <TableCell className="text-sm font-medium text-card-foreground">{inv.client}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-card-foreground tabular-nums">
                      ${inv.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${inv.avgLateDays > 7 ? "text-chart-5" : inv.avgLateDays > 0 ? "text-warning" : "text-emerald"}`}>
                        {inv.predictedPayDate}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm font-semibold tabular-nums ${inv.avgLateDays > 7 ? "text-chart-5" : inv.avgLateDays > 0 ? "text-warning" : "text-emerald"}`}>
                        {inv.avgLateDays > 0 ? `+${inv.avgLateDays}d` : "On time"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[inv.status]}>
                        {inv.status}
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
