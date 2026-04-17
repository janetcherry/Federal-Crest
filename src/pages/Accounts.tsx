import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Eye, EyeOff, Building, LineChart, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/hooks/use-auth";

interface Account {
  id: string;
  type: string;
  balance: number;
  account_number: string;
  status: string;
  apy?: string;
  return?: string;
}

export default function Accounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;

    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
            .from("accounts")
            .select("*")
            .eq("user_id", user.id)
            .order("type");

        if (error) throw error;
        setAccounts(data || []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

  const toggleNumber = (id: string) => {
    setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getAccountIcon = (type: string) => {
    switch(type) {
      case 'Checking': return <CreditCard size={24} className="opacity-80" />;
      case 'Savings': return <Building size={24} className="opacity-80" />;
      case 'Investment': return <LineChart size={24} className="opacity-80" />;
      default: return <CreditCard size={24} className="opacity-80" />;
    }
  };

  const getAccountGradient = (type: string) => {
    switch(type) {
      case 'Checking': return "from-secondary to-secondary/80 text-white";
      case 'Savings': return "from-primary to-primary/80 text-white";
      case 'Investment': return "from-slate-800 to-slate-600 text-white";
      default: return "from-secondary to-secondary/80 text-white";
    }
  };

  const AccountCard = ({ account, index }: { account: Account; index: number }) => (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <Card className={`relative overflow-hidden border-none shadow-md bg-gradient-to-br ${getAccountGradient(account.type)}`}>
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <ShieldCheck size={120} className="transform translate-x-8 -translate-y-8" />
          </div>
          <CardHeader className="pb-8 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <CardDescription className="text-white/70 uppercase tracking-wider font-medium text-xs mb-1">
                  {account.type}
                </CardDescription>
                <CardTitle className="font-serif text-2xl">
                  ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </div>
              {getAccountIcon(account.type)}
            </div>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-center text-white/90 font-mono tracking-widest">
              <span>{showNumbers[account.id] ? account.account_number.replace(/\*/g, '•') : account.account_number}</span>
              <button
                  onClick={() => toggleNumber(account.id)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                {showNumbers[account.id] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-between items-end mt-2">
              <div className="text-xs text-white/70 uppercase">
                <span className="block mb-1">Status</span>
                <span className="font-medium text-white">{account.status}</span>
              </div>
              {account.apy && (
                  <div className="text-xs text-right">
                    <span className="block text-white/70 uppercase mb-1">APY</span>
                    <span className="font-medium text-white">{account.apy}</span>
                  </div>
              )}
              {account.return && (
                  <div className="text-xs text-right">
                    <span className="block text-white/70 uppercase mb-1">YTD Return</span>
                    <span className="font-medium text-emerald-400">{account.return}</span>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
  );

  if (isLoading) {
    return (
        <DashboardLayout>
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DashboardLayout>
    );
  }

  const checkingAccounts = accounts.filter(a => a.type === "Checking");
  const savingsAccounts = accounts.filter(a => a.type === "Savings");
  const investmentAccounts = accounts.filter(a => a.type === "Investment");

  return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Your Accounts</h1>
            <p className="text-muted-foreground">Manage and view your balances.</p>
          </div>

          {accounts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No accounts yet</p>
                <p className="text-sm">Your accounts will appear here once created.</p>
              </div>
          ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-muted/50 p-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    All Accounts
                  </TabsTrigger>
                  {checkingAccounts.length > 0 && (
                      <TabsTrigger value="checking" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Checking
                      </TabsTrigger>
                  )}
                  {savingsAccounts.length > 0 && (
                      <TabsTrigger value="savings" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Savings
                      </TabsTrigger>
                  )}
                  {investmentAccounts.length > 0 && (
                      <TabsTrigger value="investment" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Investment
                      </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {accounts.map((account, index) => (
                        <AccountCard key={account.id} account={account} index={index} />
                    ))}
                  </div>
                </TabsContent>

                {checkingAccounts.length > 0 && (
                    <TabsContent value="checking" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {checkingAccounts.map((account, index) => (
                            <AccountCard key={account.id} account={account} index={index} />
                        ))}
                      </div>
                    </TabsContent>
                )}

                {savingsAccounts.length > 0 && (
                    <TabsContent value="savings" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {savingsAccounts.map((account, index) => (
                            <AccountCard key={account.id} account={account} index={index} />
                        ))}
                      </div>
                    </TabsContent>
                )}

                {investmentAccounts.length > 0 && (
                    <TabsContent value="investment" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {investmentAccounts.map((account, index) => (
                            <AccountCard key={account.id} account={account} index={index} />
                        ))}
                      </div>
                    </TabsContent>
                )}
              </Tabs>
          )}
        </div>
      </DashboardLayout>
  );
}