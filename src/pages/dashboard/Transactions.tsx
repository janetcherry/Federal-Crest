import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Filter, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  status: string;
}

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.category?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ["Date", "Description", "Category", "Status", "Amount"];
    const rows = filteredTransactions.map(tx => [
      new Date(tx.date).toLocaleDateString(),
      tx.description,
      tx.category || "",
      tx.status,
      `${tx.type === 'credit' ? '+' : '-'}${tx.amount}`
    ]);

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
        <DashboardLayout>
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DashboardLayout>
    );
  }

  return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Transaction History</h1>
              <p className="text-muted-foreground">View and filter your account activity.</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
              <Download size={16} /> Export CSV
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-muted/50 border-border"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-36 bg-muted/50">
                    <div className="flex items-center gap-2"><Filter size={14} /> <SelectValue placeholder="All Types" /></div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="credit">Credits Only</SelectItem>
                    <SelectItem value="debit">Debits Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[150px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                          No transactions found matching your criteria.
                        </TableCell>
                      </TableRow>
                  ) : (
                      filteredTransactions.map((tx, i) => (
                          <motion.tr
                              key={tx.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: i * 0.05 }}
                              className="group"
                          >
                            <TableCell className="font-medium text-muted-foreground">
                              {new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-full ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-muted text-muted-foreground'}`}>
                                  {tx.type === 'credit' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                </div>
                                <span className="font-medium text-foreground">{tx.description}</span>
                              </div>
                            </TableCell>
                            <TableCell>{tx.category || "—"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800' :
                                    tx.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800' :
                                        'bg-muted text-muted-foreground'
                              }>
                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-medium ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                              {tx.type === 'credit' ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </TableCell>
                          </motion.tr>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DashboardLayout>
  );
}