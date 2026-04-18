import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Download, CreditCard, ArrowUpRight, ArrowDownRight, Loader2, PiggyBank, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { supabase } from "@/supabaseClient";

interface Account {
  id: string;
  type: string;
  balance: number;
  account_number: string;
  status: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
}

interface SpendingData {
  month: string;
  amount: number;
}

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : user?.email?.split('@')[0] || 'User';

  const checkingAccount = accounts.find(a => a.type === "Checking");
  const savingsAccount = accounts.find(a => a.type === "Savings");
  const investmentAccount = accounts.find(a => a.type === "Investment");

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
            .from("accounts")
            .select("*")
            .eq("user_id", user.id);

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);

        // Fetch recent transactions (last 5)
        const { data: txData, error: txError } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false })
            .limit(5);

        if (txError) throw txError;
        setTransactions(txData || []);

        // Fetch spending history
        const currentYear = new Date().getFullYear();
        const { data: spendingData, error: spendingError } = await supabase
            .from("spending_history")
            .select("*")
            .eq("user_id", user.id)
            .eq("year", currentYear)
            .order("month", { ascending: true });

        if (spendingError) throw spendingError;

        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const sortedSpending = (spendingData || []).sort((a, b) =>
            monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
        );
        setSpendingData(sortedSpending);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
        <DashboardLayout>
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DashboardLayout>
    );
  }

  const isJoint = profile?.account_type === "joint" && profile?.co_owner_name;

  return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-2xl font-serif font-bold text-foreground">
                Welcome back, {displayName}
              </h1>
              {isJoint && (
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Users size={14} />
                    Joint account with {profile.co_owner_name}
                  </p>
              )}
              <p className="text-muted-foreground">Here is your financial summary for today.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex gap-3">
              <Link href="/dashboard/send">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                  <Send size={16} className="mr-2" /> Send Money
                </Button>
              </Link>
              <Link href="/dashboard/deposit">
                <Button variant="outline" className="bg-card hover:bg-muted">
                  <Download size={16} className="mr-2" /> Deposit
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Primary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Checking Account */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card className="bg-secondary text-secondary-foreground border-none shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardDescription className="text-secondary-foreground/70 text-sm font-medium uppercase tracking-wider">Available Balance</CardDescription>
                  <CardTitle className="text-4xl  text-white tracking-tight">
                    ${checkingAccount?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? "0.00"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mt-4 text-sm text-secondary-foreground/80">
                    <CreditCard size={16} />
                    <span>Checking {checkingAccount?.account_number || '••••'}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Savings Account */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <Card className="bg-card shadow-sm border-border">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Savings</CardTitle>
                  <PiggyBank size={16} className="text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    ${savingsAccount?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {savingsAccount ? 'Account active' : 'Not set up'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Investments */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <Card className="bg-card shadow-sm border-border">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Investments</CardTitle>
                  <TrendingUp size={16} className="text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    ${investmentAccount?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts & Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="lg:col-span-2">
              <Card className="bg-card shadow-sm border-border h-full">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Spending Overview</CardTitle>
                  <CardDescription>Your spending trends over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {spendingData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={spendingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} tickFormatter={(value) => `$${value}`} />
                          <Tooltip
                              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                              itemStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                          <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                        </AreaChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <TrendingUp size={40} className="mb-3 opacity-50" />
                        <p className="text-sm">No spending data yet</p>
                        <p className="text-xs mt-1">Transactions will appear here over time</p>
                      </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
              <Card className="bg-card shadow-sm border-border h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="font-serif text-lg">Recent Transactions</CardTitle>
                    <CardDescription>Latest account activity</CardDescription>
                  </div>
                  <Link href="/dashboard/transactions" className="text-sm font-medium text-primary hover:underline">
                    View All
                  </Link>
                </CardHeader>
                <CardContent className="flex-1">
                  {transactions.length > 0 ? (
                      <div className="space-y-4">
                        {transactions.slice(0, 4).map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-muted text-muted-foreground'}`}>
                                  {tx.type === 'credit' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground truncate max-w-[150px] sm:max-w-[200px]">{tx.description}</p>
                                  <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                              </div>
                              <div className={`text-sm font-medium ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                                {tx.type === 'credit' ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                              </div>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <CreditCard size={32} className="mb-3 opacity-50" />
                        <p className="text-sm">No transactions yet</p>
                        <p className="text-xs mt-1">Send or receive money to get started</p>
                      </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
  );
}