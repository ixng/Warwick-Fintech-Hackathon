// FoundersHQ Global State Store using React Context + useReducer

export interface Transaction {
  id: string
  date: string
  vendor: string
  category: string
  amount: number
  status: "cleared" | "pending" | "quarantined"
  quarantineReason?: string
}

export interface Invoice {
  id: string
  client: string
  amount: number
  issuedDate: string
  dueDate: string
  predictedPayDate: string
  avgLateDays: number
  status: "paid" | "outstanding" | "overdue"
}

export interface RiskRule {
  id: string
  type: "vendor" | "amount" | "category"
  value: string
  description: string
  createdAt: string
  triggered: number
}

export interface RunwayWeek {
  week: string
  cashBalance: number
  revenue: number
  burn: number
}

export interface AppState {
  transactions: Transaction[]
  invoices: Invoice[]
  riskRules: RiskRule[]
  runwayData: RunwayWeek[]
  companyName: string
  cashBalance: number
  monthlyRevenue: number
  monthlyBurn: number
  scenarioRevenue: number
  scenarioLatePayments: number
  scenarioHiring: number
}

const saasTransactions: Transaction[] = [
  { id: "t1", date: "2026-02-01", vendor: "AWS", category: "Infrastructure", amount: 4200, status: "cleared" },
  { id: "t2", date: "2026-02-03", vendor: "Stripe", category: "Payment Processing", amount: 890, status: "cleared" },
  { id: "t3", date: "2026-02-05", vendor: "Gusto", category: "Payroll", amount: 32000, status: "cleared" },
  { id: "t4", date: "2026-02-07", vendor: "HubSpot", category: "Marketing", amount: 1200, status: "cleared" },
  { id: "t5", date: "2026-02-09", vendor: "Notion", category: "Tools", amount: 240, status: "cleared" },
  { id: "t6", date: "2026-02-11", vendor: "Vercel", category: "Infrastructure", amount: 320, status: "cleared" },
  { id: "t7", date: "2026-02-13", vendor: "Google Ads", category: "Marketing", amount: 5600, status: "cleared" },
  { id: "t8", date: "2026-02-15", vendor: "Gusto", category: "Payroll", amount: 32000, status: "cleared" },
  { id: "t9", date: "2026-02-17", vendor: "Slack", category: "Tools", amount: 180, status: "cleared" },
  { id: "t10", date: "2026-02-19", vendor: "AWS", category: "Infrastructure", amount: 4500, status: "cleared" },
  { id: "t11", date: "2026-02-21", vendor: "ShadyConsulting LLC", category: "Consulting", amount: 95000, status: "quarantined", quarantineReason: "Amount exceeds 3x rolling average" },
  { id: "t12", date: "2026-02-23", vendor: "LinkedIn Ads", category: "Marketing", amount: 3200, status: "pending" },
  { id: "t13", date: "2026-02-25", vendor: "Datadog", category: "Infrastructure", amount: 780, status: "cleared" },
  { id: "t14", date: "2026-02-27", vendor: "Figma", category: "Tools", amount: 450, status: "cleared" },
]

const agencyTransactions: Transaction[] = [
  { id: "t1", date: "2026-02-01", vendor: "Adobe CC", category: "Software", amount: 1500, status: "cleared" },
  { id: "t2", date: "2026-02-02", vendor: "WeWork", category: "Office", amount: 8500, status: "cleared" },
  { id: "t3", date: "2026-02-05", vendor: "ADP", category: "Payroll", amount: 45000, status: "cleared" },
  { id: "t4", date: "2026-02-07", vendor: "Meta Ads", category: "Client Spend", amount: 12000, status: "cleared" },
  { id: "t5", date: "2026-02-09", vendor: "Shutterstock", category: "Media", amount: 350, status: "cleared" },
  { id: "t6", date: "2026-02-11", vendor: "Zoom", category: "Tools", amount: 200, status: "cleared" },
  { id: "t7", date: "2026-02-13", vendor: "Google Ads", category: "Client Spend", amount: 18000, status: "cleared" },
  { id: "t8", date: "2026-02-15", vendor: "ADP", category: "Payroll", amount: 45000, status: "cleared" },
  { id: "t9", date: "2026-02-17", vendor: "Canva", category: "Software", amount: 130, status: "cleared" },
  { id: "t10", date: "2026-02-19", vendor: "ShadyConsulting LLC", category: "Consulting", amount: 150000, status: "quarantined", quarantineReason: "Flagged vendor + Amount exceeds 3x rolling average" },
  { id: "t11", date: "2026-02-21", vendor: "Fiverr", category: "Freelance", amount: 2400, status: "cleared" },
  { id: "t12", date: "2026-02-23", vendor: "HubSpot", category: "CRM", amount: 3600, status: "pending" },
]

const saasInvoices: Invoice[] = [
  { id: "inv1", client: "Acme Corp", amount: 24000, issuedDate: "2026-01-15", dueDate: "2026-02-15", predictedPayDate: "2026-02-22", avgLateDays: 7, status: "overdue" },
  { id: "inv2", client: "TechFlow Inc", amount: 18500, issuedDate: "2026-01-20", dueDate: "2026-02-20", predictedPayDate: "2026-02-20", avgLateDays: 0, status: "paid" },
  { id: "inv3", client: "DataVault", amount: 36000, issuedDate: "2026-02-01", dueDate: "2026-03-01", predictedPayDate: "2026-03-15", avgLateDays: 14, status: "outstanding" },
  { id: "inv4", client: "CloudNine SaaS", amount: 12000, issuedDate: "2026-02-05", dueDate: "2026-03-05", predictedPayDate: "2026-03-08", avgLateDays: 3, status: "outstanding" },
  { id: "inv5", client: "FinServe Pro", amount: 42000, issuedDate: "2026-01-10", dueDate: "2026-02-10", predictedPayDate: "2026-02-28", avgLateDays: 18, status: "overdue" },
  { id: "inv6", client: "RetailMax", amount: 8500, issuedDate: "2026-02-10", dueDate: "2026-03-10", predictedPayDate: "2026-03-12", avgLateDays: 2, status: "outstanding" },
]

const agencyInvoices: Invoice[] = [
  { id: "inv1", client: "Nike (Regional)", amount: 65000, issuedDate: "2026-01-01", dueDate: "2026-02-01", predictedPayDate: "2026-02-15", avgLateDays: 14, status: "overdue" },
  { id: "inv2", client: "Local Brewery Co", amount: 12000, issuedDate: "2026-01-15", dueDate: "2026-02-15", predictedPayDate: "2026-02-15", avgLateDays: 0, status: "paid" },
  { id: "inv3", client: "EcoFoods", amount: 28000, issuedDate: "2026-02-01", dueDate: "2026-03-01", predictedPayDate: "2026-03-22", avgLateDays: 21, status: "outstanding" },
  { id: "inv4", client: "AutoDealership Group", amount: 45000, issuedDate: "2026-02-05", dueDate: "2026-03-05", predictedPayDate: "2026-03-10", avgLateDays: 5, status: "outstanding" },
  { id: "inv5", client: "StartupXYZ", amount: 8000, issuedDate: "2026-01-20", dueDate: "2026-02-20", predictedPayDate: "2026-03-20", avgLateDays: 28, status: "overdue" },
]

const defaultRiskRules: RiskRule[] = [
  { id: "r1", type: "vendor", value: "ShadyConsulting LLC", description: "Flagged for suspicious consulting charges", createdAt: "2026-01-15", triggered: 3 },
  { id: "r2", type: "amount", value: "50000", description: "Auto-quarantine transactions above $50,000", createdAt: "2026-01-20", triggered: 1 },
  { id: "r3", type: "vendor", value: "CryptoPayouts Inc", description: "Unverified crypto payment processor", createdAt: "2026-02-01", triggered: 0 },
]

function generateRunwayData(cashBalance: number, monthlyRevenue: number, monthlyBurn: number): RunwayWeek[] {
  const weeks: RunwayWeek[] = []
  let balance = cashBalance
  const weeklyRevenue = monthlyRevenue / 4
  const weeklyBurn = monthlyBurn / 4

  for (let i = 0; i < 12; i++) {
    balance = balance + weeklyRevenue - weeklyBurn
    weeks.push({
      week: `W${i + 1}`,
      cashBalance: Math.max(0, Math.round(balance)),
      revenue: Math.round(weeklyRevenue * (0.9 + Math.random() * 0.2)),
      burn: Math.round(weeklyBurn * (0.95 + Math.random() * 0.1)),
    })
  }
  return weeks
}

export function getSaaSData(): AppState {
  return {
    transactions: saasTransactions,
    invoices: saasInvoices,
    riskRules: [...defaultRiskRules],
    runwayData: generateRunwayData(520000, 85000, 72000),
    companyName: "NeuralSync (SaaS)",
    cashBalance: 520000,
    monthlyRevenue: 85000,
    monthlyBurn: 72000,
    scenarioRevenue: 85000,
    scenarioLatePayments: 15,
    scenarioHiring: 0,
  }
}

export function getAgencyData(): AppState {
  return {
    transactions: agencyTransactions,
    invoices: agencyInvoices,
    riskRules: [...defaultRiskRules],
    runwayData: generateRunwayData(340000, 120000, 105000),
    companyName: "PixelForge Agency (B2B)",
    cashBalance: 340000,
    monthlyRevenue: 120000,
    monthlyBurn: 105000,
    scenarioRevenue: 120000,
    scenarioLatePayments: 20,
    scenarioHiring: 0,
  }
}

export function getEmptyState(): AppState {
  return {
    transactions: [],
    invoices: [],
    riskRules: [...defaultRiskRules],
    runwayData: generateRunwayData(100000, 0, 10000),
    companyName: "Your Startup",
    cashBalance: 100000,
    monthlyRevenue: 0,
    monthlyBurn: 10000,
    scenarioRevenue: 0,
    scenarioLatePayments: 0,
    scenarioHiring: 0,
  }
}

// Anomaly detection engine
export function detectAnomalies(
  transaction: Transaction,
  allTransactions: Transaction[],
  riskRules: RiskRule[]
): { isAnomaly: boolean; reasons: string[] } {
  const reasons: string[] = []

  // Check flagged vendors
  const flaggedVendors = riskRules.filter((r) => r.type === "vendor").map((r) => r.value.toLowerCase())
  if (flaggedVendors.includes(transaction.vendor.toLowerCase())) {
    reasons.push(`Flagged vendor: ${transaction.vendor}`)
  }

  // Check 3x rolling average
  const cleared = allTransactions.filter((t) => t.status === "cleared")
  if (cleared.length > 0) {
    const avg = cleared.reduce((sum, t) => sum + t.amount, 0) / cleared.length
    if (transaction.amount > avg * 3) {
      reasons.push(`Amount ($${transaction.amount.toLocaleString()}) exceeds 3x rolling average ($${Math.round(avg).toLocaleString()})`)
    }
  }

  // Check amount rules
  const amountRules = riskRules.filter((r) => r.type === "amount")
  for (const rule of amountRules) {
    if (transaction.amount > parseFloat(rule.value)) {
      reasons.push(`Amount exceeds threshold: $${parseFloat(rule.value).toLocaleString()}`)
    }
  }

  return { isAnomaly: reasons.length > 0, reasons }
}
