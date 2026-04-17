import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, ArrowRight, Shield, Building2, Bitcoin, Copy, CheckCircle2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/supabaseClient";

interface Account {
  id: string;
  type: string;
  balance: number;
  account_number: string;
}

export default function SendFunds() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC");
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchAccounts = async () => {
      const { data } = await supabase
          .from("accounts")
          .select("id, type, balance, account_number")
          .eq("user_id", user.id);
      if (data) setAccounts(data);
    };
    fetchAccounts();
  }, [user]);

  const handleNext = () => {
    if (step === 1 && amount && recipient && selectedAccount) {
      setStep(2);
    }
  };

  const handleCryptoNext = () => {
    if (step === 1 && amount && cryptoAddress && selectedAccount) {
      setStep(2);
    }
  };

  const handleConfirm = () => {
    toast({
      title: "Transfer Initiated",
      description: `Successfully sent $${amount} to ${recipient}.`,
    });
    resetForm();
  };

  const handleCryptoConfirm = () => {
    toast({
      title: "Crypto Transfer Initiated",
      description: `Sending ${amount} ${cryptoCurrency} to ${cryptoAddress.slice(0, 8)}...`,
    });
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setAmount("");
    setRecipient("");
    setCryptoAddress("");
    setSelectedAccount("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ description: "Address copied to clipboard" });
  };

  return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Send Funds</h1>
            <p className="text-muted-foreground">Transfer money domestically, internationally, or via crypto.</p>
          </div>

          <Tabs defaultValue="crypto" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="crypto" className="relative">
                <Bitcoin size={16} className="mr-1" /> Crypto
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Zap size={8} /> FASTEST
              </span>
              </TabsTrigger>
              <TabsTrigger value="domestic">Domestic</TabsTrigger>
              <TabsTrigger value="international">International</TabsTrigger>
            </TabsList>

            {/* Crypto Transfer Tab */}
            <TabsContent value="crypto" className="mt-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-border pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-serif">
                    <Bitcoin className="text-amber-500" size={20} /> Crypto Transfer
                    <Badge className="ml-2 bg-emerald-500 text-white border-0">
                      <Zap size={12} className="mr-1" /> Fastest Settlement
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Send Bitcoin, Ethereum, or USDC globally in minutes with low fees.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {step === 1 ? (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="from-account">From Account</Label>
                          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select funding account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map(acc => (
                                  <SelectItem key={acc.id} value={acc.id}>
                                    <div className="flex justify-between items-center w-full">
                                      <span>{acc.type} (...{acc.account_number?.slice(-4) || '****'})</span>
                                      <span className="ml-4 font-medium text-muted-foreground">
                                  ${acc.balance.toLocaleString()}
                                </span>
                                    </div>
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="crypto-currency">Cryptocurrency</Label>
                          <Select value={cryptoCurrency} onValueChange={setCryptoCurrency}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BTC">Bitcoin (BTC) – Fast & Secure</SelectItem>
                              <SelectItem value="ETH">Ethereum (ETH) – Smart Contracts</SelectItem>
                              <SelectItem value="USDC">USD Coin (USDC) – Stablecoin</SelectItem>
                              <SelectItem value="USDT">Tether (USDT) – Widely Accepted</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="crypto-address">Recipient Wallet Address</Label>
                          <div className="relative">
                            <Input
                                id="crypto-address"
                                placeholder="0x... or bc1..."
                                className="h-12 pr-10 font-mono text-sm"
                                value={cryptoAddress}
                                onChange={(e) => setCryptoAddress(e.target.value)}
                            />
                            {cryptoAddress && (
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(cryptoAddress)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                </button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Enter the recipient's wallet address. Double-check for accuracy.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="crypto-amount">Amount ({cryptoCurrency})</Label>
                          <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                          {cryptoCurrency === 'USDC' || cryptoCurrency === 'USDT' ? '$' : 'Ƀ'}
                        </span>
                            <Input
                                id="crypto-amount"
                                type="number"
                                placeholder="0.00"
                                className="h-14 pl-10 text-lg font-medium"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ≈ ${(parseFloat(amount) * (cryptoCurrency === 'BTC' ? 65000 : 1)).toLocaleString()} USD
                          </p>
                        </div>

                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
                          <Zap size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                              Fastest Settlement – 10-30 minutes
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Crypto transfers are processed on-chain and typically confirm within minutes.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                  ) : (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center py-6">
                        <Shield className="mx-auto text-primary mb-4" size={48} />
                        <h3 className="text-xl font-serif font-bold text-foreground">Confirm Crypto Transfer</h3>
                        <p className="text-muted-foreground">Please verify the details before sending.</p>

                        <div className="bg-muted p-6 rounded-lg mt-6 space-y-4 text-left">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Network</span>
                            <span className="font-medium">{cryptoCurrency === 'BTC' ? 'Bitcoin' : cryptoCurrency === 'ETH' ? 'Ethereum' : cryptoCurrency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">To Address</span>
                            <span className="font-medium font-mono text-sm">{cryptoAddress.slice(0, 12)}...{cryptoAddress.slice(-8)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-medium text-lg">{amount} {cryptoCurrency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Network Fee</span>
                            <span className="font-medium">~0.0001 {cryptoCurrency}</span>
                          </div>
                          <div className="border-t border-border pt-4 flex justify-between">
                            <span className="text-foreground font-medium">Total</span>
                            <span className="font-bold text-xl text-primary">
                          {(parseFloat(amount) + 0.0001).toFixed(6)} {cryptoCurrency}
                        </span>
                          </div>
                        </div>
                      </motion.div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-border bg-muted/10 p-6 flex justify-between">
                  {step === 2 && (
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  )}
                  <Button
                      className={`ml-auto ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                      onClick={step === 1 ? handleCryptoNext : handleCryptoConfirm}
                      disabled={step === 1 && (!amount || !cryptoAddress || !selectedAccount)}
                  >
                    {step === 1 ? (
                        <>Review Transfer <ArrowRight size={16} className="ml-2" /></>
                    ) : (
                        <>Confirm & Send Crypto <Bitcoin size={16} className="ml-2" /></>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Domestic Transfer Tab (existing, updated to use real accounts) */}
            <TabsContent value="domestic" className="mt-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="bg-muted/30 border-b border-border pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-serif">
                    <Send className="text-primary" size={20} /> Domestic Transfer
                  </CardTitle>
                  <CardDescription>Send funds to any US bank account instantly.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {step === 1 ? (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="from-account">From Account</Label>
                          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map(acc => (
                                  <SelectItem key={acc.id} value={acc.id}>
                                    <div className="flex justify-between items-center w-full">
                                      <span>{acc.type} (...{acc.account_number?.slice(-4) || '****'})</span>
                                      <span className="ml-4 font-medium text-muted-foreground">
                                  ${acc.balance.toLocaleString()}
                                </span>
                                    </div>
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="recipient">Recipient Name or Account</Label>
                          <Input
                              id="recipient"
                              placeholder="e.g. John Doe or Account Number"
                              className="h-12"
                              value={recipient}
                              onChange={(e) => setRecipient(e.target.value)}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="amount">Amount (USD)</Label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                className="h-14 pl-8 text-lg font-medium"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                          </div>
                        </div>
                      </motion.div>
                  ) : (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center py-6">
                        <Shield className="mx-auto text-primary mb-4" size={48} />
                        <h3 className="text-xl font-serif font-bold text-foreground">Confirm Transfer</h3>
                        <p className="text-muted-foreground">Please review the details before confirming.</p>

                        <div className="bg-muted p-6 rounded-lg mt-6 space-y-4 text-left">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">To</span>
                            <span className="font-medium">{recipient}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-medium text-lg">${amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fee</span>
                            <span className="font-medium">$0.00</span>
                          </div>
                          <div className="border-t border-border pt-4 flex justify-between">
                            <span className="text-foreground font-medium">Total</span>
                            <span className="font-bold text-xl text-primary">${amount}</span>
                          </div>
                        </div>
                      </motion.div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-border bg-muted/10 p-6 flex justify-between">
                  {step === 2 && (
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  )}
                  <Button
                      className={`ml-auto ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                      onClick={step === 1 ? handleNext : handleConfirm}
                      disabled={step === 1 && (!amount || !recipient || !selectedAccount)}
                  >
                    {step === 1 ? (
                        <>Review Transfer <ArrowRight size={16} className="ml-2" /></>
                    ) : (
                        <>Confirm & Send <Shield size={16} className="ml-2" /></>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* International Transfer Tab */}
            <TabsContent value="international">
              <Card className="border-border shadow-sm p-12 text-center">
                <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">International Wire Transfers</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Send funds globally via the SWIFT network to over 180 countries in 40+ currencies.
                </p>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  Setup International Recipient
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
  );
}

// Simple Badge component (inline for brevity)
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);