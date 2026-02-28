"use client"

import React, { createContext, useContext, useReducer, type ReactNode } from "react"
import {
  type AppState,
  type Transaction,
  type RiskRule,
  getEmptyState,
  getSaaSData,
  getAgencyData,
  detectAnomalies,
} from "./store"

type Action =
  | { type: "LOAD_SAAS" }
  | { type: "LOAD_AGENCY" }
  | { type: "ADD_TRANSACTION"; payload: Omit<Transaction, "id" | "status"> }
  | { type: "IMPORT_TRANSACTIONS"; payload: Omit<Transaction, "id" | "status">[] }
  | { type: "APPROVE_TRANSACTION"; payload: string }
  | { type: "REJECT_TRANSACTION"; payload: string }
  | { type: "ADD_RISK_RULE"; payload: Omit<RiskRule, "id" | "createdAt" | "triggered"> }
  | { type: "REMOVE_RISK_RULE"; payload: string }
  | { type: "SET_SCENARIO"; payload: { field: "scenarioRevenue" | "scenarioLatePayments" | "scenarioHiring"; value: number } }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOAD_SAAS":
      return getSaaSData()
    case "LOAD_AGENCY":
      return getAgencyData()
    case "ADD_TRANSACTION": {
      const newTx: Transaction = {
        ...action.payload,
        id: `t${Date.now()}`,
        status: "pending",
      }
      const { isAnomaly, reasons } = detectAnomalies(newTx, state.transactions, state.riskRules)
      if (isAnomaly) {
        newTx.status = "quarantined"
        newTx.quarantineReason = reasons.join("; ")
        // Increment triggered count on matching rules
        const updatedRules = state.riskRules.map((r) => {
          if (r.type === "vendor" && r.value.toLowerCase() === newTx.vendor.toLowerCase()) {
            return { ...r, triggered: r.triggered + 1 }
          }
          if (r.type === "amount" && newTx.amount > parseFloat(r.value)) {
            return { ...r, triggered: r.triggered + 1 }
          }
          return r
        })
        return { ...state, transactions: [...state.transactions, newTx], riskRules: updatedRules }
      }
      return { ...state, transactions: [...state.transactions, newTx] }
    }
    case "IMPORT_TRANSACTIONS": {
      const newTransactions = action.payload.map((tx, i) => {
        const newTx: Transaction = {
          ...tx,
          id: `t${Date.now()}_${i}`,
          status: "pending",
        }
        const { isAnomaly, reasons } = detectAnomalies(newTx, state.transactions, state.riskRules)
        if (isAnomaly) {
          newTx.status = "quarantined"
          newTx.quarantineReason = reasons.join("; ")
        }
        return newTx
      })
      return { ...state, transactions: [...state.transactions, ...newTransactions] }
    }
    case "APPROVE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload ? { ...t, status: "cleared" as const, quarantineReason: undefined } : t
        ),
      }
    case "REJECT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      }
    case "ADD_RISK_RULE": {
      const newRule: RiskRule = {
        ...action.payload,
        id: `r${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
        triggered: 0,
      }
      return { ...state, riskRules: [...state.riskRules, newRule] }
    }
    case "REMOVE_RISK_RULE":
      return { ...state, riskRules: state.riskRules.filter((r) => r.id !== action.payload) }
    case "SET_SCENARIO":
      return { ...state, [action.payload.field]: action.payload.value }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, getEmptyState())
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppState must be used within AppProvider")
  return ctx
}
