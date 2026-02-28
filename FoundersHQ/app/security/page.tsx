"use client"

import { useState } from "react"
import { useAppState } from "@/lib/app-context"
import { TopBar } from "@/components/top-bar"
import { AnomalyDetector } from "@/components/spending/anomaly-detector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, Plus, Trash2, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react"

export default function SecurityPage() {
  const { state, dispatch } = useAppState()
  const [ruleType, setRuleType] = useState<"vendor" | "amount" | "category">("vendor")
  const [ruleValue, setRuleValue] = useState("")
  const [ruleDesc, setRuleDesc] = useState("")

  const quarantinedCount = state.transactions.filter((t) => t.status === "quarantined").length
  const totalTriggered = state.riskRules.reduce((sum, r) => sum + r.triggered, 0)

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ruleValue) return
    dispatch({
      type: "ADD_RISK_RULE",
      payload: {
        type: ruleType,
        value: ruleValue,
        description: ruleDesc || `Auto-flag ${ruleType}: ${ruleValue}`,
      },
    })
    setRuleValue("")
    setRuleDesc("")
  }

  return (
    <>
      <TopBar title="Security Shield" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Security overview cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Firewall Status</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10">
                    <ShieldCheck className="h-4 w-4 text-emerald" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald">Active</p>
                <p className="mt-1 text-xs text-muted-foreground">{state.riskRules.length} rules configured</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Quarantined</p>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${quarantinedCount > 0 ? "bg-chart-5/10" : "bg-emerald/10"}`}>
                    <ShieldAlert className={`h-4 w-4 ${quarantinedCount > 0 ? "text-chart-5" : "text-emerald"}`} />
                  </div>
                </div>
                <p className={`mt-2 text-2xl font-bold tracking-tight ${quarantinedCount > 0 ? "text-chart-5" : "text-card-foreground"}`}>
                  {quarantinedCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">transactions held</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Total Triggers</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{totalTriggered}</p>
                <p className="mt-1 text-xs text-muted-foreground">across all rules</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Risk rules management */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald" />
                    <CardTitle className="text-base font-semibold text-card-foreground">
                      Risk Rules Engine
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {state.riskRules.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No risk rules configured</p>
                  ) : (
                    <div className="overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">Type</TableHead>
                            <TableHead className="text-muted-foreground">Value</TableHead>
                            <TableHead className="text-muted-foreground">Description</TableHead>
                            <TableHead className="text-right text-muted-foreground">Triggered</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {state.riskRules.map((rule) => (
                            <TableRow key={rule.id} className="border-border">
                              <TableCell>
                                <Badge variant="outline" className={
                                  rule.type === "vendor"
                                    ? "bg-chart-4/10 text-chart-4 border-chart-4/20"
                                    : rule.type === "amount"
                                    ? "bg-warning/10 text-warning border-warning/20"
                                    : "bg-chart-2/10 text-chart-2 border-chart-2/20"
                                }>
                                  {rule.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-medium text-card-foreground">
                                {rule.type === "amount" ? `$${parseFloat(rule.value).toLocaleString()}` : rule.value}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                {rule.description}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={`text-sm font-semibold tabular-nums ${rule.triggered > 0 ? "text-warning" : "text-muted-foreground"}`}>
                                  {rule.triggered}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => dispatch({ type: "REMOVE_RISK_RULE", payload: rule.id })}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-chart-5"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Add rule form */}
                  <form onSubmit={handleAddRule} className="mt-4 rounded-lg border border-border bg-secondary/50 p-4">
                    <p className="mb-3 text-sm font-semibold text-card-foreground">Add New Rule</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Rule Type</Label>
                        <Select value={ruleType} onValueChange={(v) => setRuleType(v as "vendor" | "amount" | "category")}>
                          <SelectTrigger className="border-border bg-card text-card-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="vendor">Vendor</SelectItem>
                            <SelectItem value="amount">Amount Threshold</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Value</Label>
                        <Input
                          placeholder={ruleType === "amount" ? "50000" : "Vendor name..."}
                          value={ruleValue}
                          onChange={(e) => setRuleValue(e.target.value)}
                          className="border-border bg-card text-card-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <Input
                          placeholder="Rule description..."
                          value={ruleDesc}
                          onChange={(e) => setRuleDesc(e.target.value)}
                          className="border-border bg-card text-card-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="mt-3 bg-emerald text-emerald-foreground hover:bg-emerald/90"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add Rule
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Anomaly detector */}
            <div className="lg:col-span-1">
              <AnomalyDetector />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
