import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera, Upload, Smartphone, Building, Bitcoin, Copy, CheckCircle2,
  RefreshCw, Loader2, AlertCircle, Clock, CheckCircle, XCircle, MessageCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Deposit() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [depositAccount, setDepositAccount] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [depositRequests, setDepositRequests] = useState<any[]>([]);

  // Crypto form state
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC");
  const [network, setNetwork] = useState("BTC");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchDepositDetails();
    fetchAccounts();
    fetchDepositRequests();
  }, [user]);

  useEffect(() => {
    if (cryptoCurrency === "BTC") setNetwork("BTC");
    else if (cryptoCurrency === "ETH") setNetwork("ERC20");
    else if (cryptoCurrency === "USDT") setNetwork("TRC20");
  }, [cryptoCurrency]);

  const fetchDepositDetails = async () => {
    const { data } = await supabase
        .from("deposit_accounts")
        .select("*")
        .eq("user_id", user!.id)
        .single();
    if (data) setDepositAccount(data);
  };

  const fetchAccounts = async () => {
    const { data } = await supabase
        .from("accounts")
        .select("id, type, balance")
        .eq("user_id", user!.id);
    if (data) setAccounts(data);
  };

  const fetchDepositRequests = async () => {
    const { data } = await supabase
        .from("deposit_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
    if (data) setDepositRequests(data);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast({ description: `${type} copied to clipboard` });
  };

  const getCryptoPrice = (currency: string): number => {
    const prices: Record<string, number> = { BTC: 65000, ETH: 3200, USDT: 1.0 };
    return prices[currency] || 0;
  };

  const handleCryptoDeposit = async () => {
    if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
      toast({ description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    const cryptoValue = parseFloat(cryptoAmount);
    const usdAmount = cryptoValue * getCryptoPrice(cryptoCurrency);

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("deposit_requests").insert({
        user_id: user!.id,
        crypto_currency: cryptoCurrency,
        network,
        amount_crypto: cryptoValue,
        amount_usd: usdAmount,
        tx_hash: txHash || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Deposit Request Submitted",
        description: `Your deposit of ${cryptoValue} ${cryptoCurrency} is pending confirmation.`,
      });

      setCryptoAmount("");
      setTxHash("");
      fetchDepositRequests();
    } catch (error) {
      console.error("Deposit request error:", error);
      toast({ title: "Submission Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const routingNumber = "122000248";

  if (!depositAccount) {
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
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Deposit Funds</h1>
            <p className="text-muted-foreground">Add funds to your Checking account via multiple secure methods.</p>
          </div>

          <Tabs defaultValue="crypto" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="crypto" className="gap-2"><Bitcoin size={16} /> Crypto</TabsTrigger>
              <TabsTrigger value="mobile" className="gap-2"><Smartphone size={16} /> Mobile Check</TabsTrigger>
              <TabsTrigger value="direct" className="gap-2"><Building size={16} /> Direct Deposit</TabsTrigger>
              <TabsTrigger value="wire" className="gap-2"><Building size={16} /> Wire</TabsTrigger>
            </TabsList>

            {/* Crypto Deposit Tab */}
            <TabsContent value="crypto" className="mt-6 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-border">
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Bitcoin className="text-amber-500" size={20} /> Crypto Deposit
                  </CardTitle>
                  <CardDescription>
                    Submit your crypto deposit details after sending funds to the provided address.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Support Contact Message */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
                    <MessageCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Need the crypto wallet address?
                      </p>
                      <p className="text-sm text-muted-foreground">
                        For fast crypto deposits, please contact our support team to receive the current wallet address.
                      </p>
                      <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400" asChild>
                        <a href="mailto:support@federalcrest.com">Contact Support</a>
                      </Button>
                    </div>
                  </div>

                  {/* Cryptocurrency & Network */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cryptocurrency</Label>
                      <Select value={cryptoCurrency} onValueChange={setCryptoCurrency}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="USDT">Tether (USDT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Network</Label>
                      <Select value={network} onValueChange={setNetwork}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {cryptoCurrency === "BTC" && (<><SelectItem value="BTC">Bitcoin</SelectItem><SelectItem value="BEP20">BEP20</SelectItem></>)}
                          {cryptoCurrency === "ETH" && (<><SelectItem value="ERC20">ERC20</SelectItem><SelectItem value="BEP20">BEP20</SelectItem><SelectItem value="ARB">Arbitrum</SelectItem><SelectItem value="OP">Optimism</SelectItem></>)}
                          {cryptoCurrency === "USDT" && (<><SelectItem value="ERC20">ERC20</SelectItem><SelectItem value="TRC20">TRC20</SelectItem><SelectItem value="BEP20">BEP20</SelectItem><SelectItem value="SOL">Solana</SelectItem></>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Amount & Tx Hash */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Amount Sent ({cryptoCurrency})</Label>
                      <Input type="number" placeholder="0.00" value={cryptoAmount} onChange={(e) => setCryptoAmount(e.target.value)} />
                      {cryptoAmount && <p className="text-sm">≈ ${((parseFloat(cryptoAmount) || 0) * getCryptoPrice(cryptoCurrency)).toFixed(2)} USD</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Transaction Hash (Optional)</Label>
                      <Input placeholder="0x... or tx id" value={txHash} onChange={(e) => setTxHash(e.target.value)} />
                    </div>
                    <Button onClick={handleCryptoDeposit} disabled={isSubmitting} className="w-full">
                      {isSubmitting ? <RefreshCw size={16} className="animate-spin mr-2" /> : null}
                      Submit Deposit Request
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Your deposit will be reviewed and credited shortly after confirmation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Deposit Requests */}
              {depositRequests.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="font-serif text-lg">Your Deposit Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {depositRequests.map((req) => (
                          <div key={req.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {req.status === "pending" && <Clock size={20} className="text-amber-500" />}
                              {req.status === "approved" && <CheckCircle size={20} className="text-emerald-500" />}
                              {req.status === "rejected" && <XCircle size={20} className="text-destructive" />}
                              <div>
                                <p className="font-medium">{req.amount_crypto} {req.crypto_currency} → ${req.amount_usd.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                            <Badge variant={req.status === "approved" ? "default" : req.status === "rejected" ? "destructive" : "secondary"}>
                              {req.status}
                            </Badge>
                          </div>
                      ))}
                    </CardContent>
                  </Card>
              )}
            </TabsContent>

            {/* Mobile Check Deposit Tab (unchanged) */}
            <TabsContent value="mobile" className="mt-6">
              {/* ... same as before ... */}
            </TabsContent>

            {/* Direct Deposit Tab (unchanged) */}
            <TabsContent value="direct" className="mt-6">
              {/* ... same as before ... */}
            </TabsContent>

            {/* Wire Transfer Tab (unchanged) */}
            <TabsContent value="wire" className="mt-6">
              {/* ... same as before ... */}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
  );
}