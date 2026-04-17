export const mockAccounts = [
  { id: "acc-1", type: "Checking", balance: 24850.00, number: "**** **** **** 4921", status: "Active" },
];

export const mockTransactions = [
  { id: "tx-1", date: "2024-03-15", description: "Direct Deposit - INTL CORP", amount: 4250.00, status: "completed", category: "Income", type: "credit" },
  { id: "tx-2", date: "2024-03-14", description: "Wire Transfer - James Smith", amount: -1500.00, status: "completed", category: "Transfer", type: "debit" },
  { id: "tx-3", date: "2024-03-12", description: "Whole Foods Market", amount: -124.50, status: "completed", category: "Groceries", type: "debit" },
  { id: "tx-4", date: "2024-03-10", description: "Equinox", amount: -85.20, status: "completed", category: "Groceries", type: "debit" },
  { id: "tx-5", date: "2024-03-08", description: "Monthly Maintenance Fee", amount: -15.00, status: "completed", category: "Fees", type: "debit" },
  { id: "tx-6", date: "2024-03-05", description: "Dividend Payment", amount: 345.20, status: "completed", category: "Investment", type: "credit" },
  { id: "tx-7", date: "2024-03-01", description: "Direct Deposit - INTL CORP", amount: 4250.00, status: "completed", category: "Income", type: "credit" },
];

export const mockSpendingData = [
  { month: "Jan", amount: 3200 },
  { month: "Feb", amount: 2800 },
  { month: "Mar", amount: 3500 },
  { month: "Apr", amount: 2900 },
  { month: "May", amount: 4100 },
  { month: "Jun", amount: 3800 },
];
