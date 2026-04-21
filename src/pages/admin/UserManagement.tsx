import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowLeft, Search, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Account {
    id: string;
    user_id: string;
    type: string;
    balance: number;
    account_number: string;
}

export default function UserManagement() {
    const { user: currentUser, profile } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [userAccounts, setUserAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">("increase");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, email")
            .order("created_at", { ascending: false });

        if (!error) setUsers(data || []);
        setIsLoadingUsers(false);
    };

    const fetchUserAccounts = async (userId: string) => {
        setIsLoadingAccounts(true);
        const { data, error } = await supabase
            .from("accounts")
            .select("*")
            .eq("user_id", userId)
            .order("type");

        if (!error) setUserAccounts(data || []);
        setIsLoadingAccounts(false);
    };

    const handleSelectUser = (user: UserProfile) => {
        setSelectedUser(user);
        fetchUserAccounts(user.id);
        setSelectedAccount(null);
        setAmount("");
        setReason("");
    };

    const filteredUsers = users.filter(u =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !selectedAccount || !amount || parseFloat(amount) <= 0) {
            toast({ title: "Error", description: "Please fill all fields with valid values.", variant: "destructive" });
            return;
        }

        const amountValue = parseFloat(amount);
        if (adjustmentType === "decrease" && amountValue > selectedAccount.balance) {
            toast({ title: "Error", description: "Insufficient balance for this decrease.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const newBalance = adjustmentType === "increase"
                ? selectedAccount.balance + amountValue
                : selectedAccount.balance - amountValue;

            // Update account balance
            const { error: updateError } = await supabase
                .from("accounts")
                .update({ balance: newBalance })
                .eq("id", selectedAccount.id);

            if (updateError) throw updateError;

            // Create transaction record
            const description = `Admin ${adjustmentType}: ${reason || "Manual adjustment"} (by ${profile?.first_name || "Admin"})`;
            const { error: txError } = await supabase
                .from("transactions")
                .insert({
                    account_id: selectedAccount.id,
                    user_id: selectedUser.id,
                    date: new Date().toISOString(),
                    description,
                    amount: amountValue,
                    type: adjustmentType === "increase" ? "credit" : "debit",
                    category: "Admin Adjustment",
                    status: "completed",
                });

            if (txError) throw txError;

            toast({
                title: "Success",
                description: `${selectedUser.first_name}'s ${selectedAccount.type} balance updated by $${amountValue.toFixed(2)}.`,
            });

            // Refresh accounts
            fetchUserAccounts(selectedUser.id);
            setAmount("");
            setReason("");
        } catch (error: any) {
            console.error("Adjustment error:", error);
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profile?.is_admin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Access Denied</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-foreground">User Balance Management</h1>
                        <p className="text-muted-foreground">Adjust checking or savings balances for any user.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User List */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="font-serif">Users</CardTitle>
                            <CardDescription>Select a user to manage</CardDescription>
                            <div className="relative mt-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input
                                    placeholder="Search by name or email"
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="max-h-[500px] overflow-y-auto">
                            {isLoadingUsers ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No users found.</p>
                            ) : (
                                <div className="space-y-2">
                                    {filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                selectedUser?.id === user.id
                                                    ? "bg-primary/10 border border-primary/30"
                                                    : "hover:bg-muted/50 border border-transparent"
                                            }`}
                                            onClick={() => handleSelectUser(user)}
                                        >
                                            <p className="font-medium">{user.first_name} {user.last_name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Adjustment Form */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-serif">
                                {selectedUser
                                    ? `Adjust Balance for ${selectedUser.first_name} ${selectedUser.last_name}`
                                    : "Select a user to begin"}
                            </CardTitle>
                            <CardDescription>
                                Choose an account and enter the adjustment details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!selectedUser ? (
                                <p className="text-center text-muted-foreground py-8">Select a user from the list.</p>
                            ) : isLoadingAccounts ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : userAccounts.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No accounts found for this user.</p>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Select Account</Label>
                                        <Select
                                            value={selectedAccount?.id || ""}
                                            onValueChange={(val) => setSelectedAccount(userAccounts.find(a => a.id === val) || null)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose an account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {userAccounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id}>
                                                        {acc.type} (****{acc.account_number?.slice(-4)}) – ${acc.balance.toFixed(2)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedAccount && (
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-sm">Current Balance: <span className="font-medium">${selectedAccount.balance.toFixed(2)}</span></p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Adjustment Type</Label>
                                        <Select value={adjustmentType} onValueChange={(v) => setAdjustmentType(v as "increase" | "decrease")}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="increase">Increase (Credit)</SelectItem>
                                                <SelectItem value="decrease">Decrease (Debit)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Amount (USD)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                placeholder="0.00"
                                                className="pl-7"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Reason (Optional)</Label>
                                        <Input
                                            placeholder="e.g., Correction, Bonus, Fee reversal"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isSubmitting || !selectedAccount || !amount}>
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Apply Adjustment
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}