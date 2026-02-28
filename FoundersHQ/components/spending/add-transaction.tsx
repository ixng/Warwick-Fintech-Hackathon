"use client"

import { useState, useRef } from "react"
import { useAppState } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Upload } from "lucide-react"

export function AddTransaction() {
  const { dispatch } = useAppState()
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    vendor: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.vendor || !form.amount) return
    dispatch({
      type: "ADD_TRANSACTION",
      payload: {
        vendor: form.vendor,
        category: form.category || "Uncategorized",
        amount: parseFloat(form.amount),
        date: form.date,
      },
    })
    setForm({ vendor: "", category: "", amount: "", date: new Date().toISOString().split("T")[0] })
  }

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split("\n").slice(1) // skip header
      const txs = lines
        .filter((l) => l.trim())
        .map((line) => {
          const parts = line.split(",").map((p) => p.trim())
          return {
            date: parts[0] || new Date().toISOString().split("T")[0],
            vendor: parts[1] || "Unknown",
            category: parts[2] || "Uncategorized",
            amount: parseFloat(parts[3]) || 0,
          }
        })
      dispatch({ type: "IMPORT_TRANSACTIONS", payload: txs })
    }
    reader.readAsText(file)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-emerald" />
          <CardTitle className="text-base font-semibold text-card-foreground">Add Transaction</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="vendor" className="text-xs text-muted-foreground">Vendor</Label>
              <Input
                id="vendor"
                placeholder="e.g. AWS"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                className="border-border bg-secondary text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs text-muted-foreground">Category</Label>
              <Input
                id="category"
                placeholder="e.g. Infrastructure"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border-border bg-secondary text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs text-muted-foreground">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border-border bg-secondary text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs text-muted-foreground">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border-border bg-secondary text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-emerald text-emerald-foreground hover:bg-emerald/90">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Transaction
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              className="border-border text-muted-foreground hover:bg-secondary hover:text-card-foreground"
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Import CSV
            </Button>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
