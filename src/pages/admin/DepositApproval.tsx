import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function DepositApproval() {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch all deposit requests
            const { data: requestsData, error: requestsError } = await supabase
                .from("deposit_requests")
                .select("*")
                .order("created_at", { ascending: false });

            if (requestsError) throw requestsError;

            if (!requestsData || requestsData.length === 0) {
                setRequests([]);
                setIsLoading(false);
                return;
            }

            // 2. Get unique user IDs
            const userIds = [...new Set(requestsData.map(r => r.user_id))];

            // 3. Fetch profiles for those users
            const { data: profilesData, error: profilesError } = await supabase
                .from("profiles")
                .select("id, first_name, last_name, email")
                .in("id", userIds);

            if (profilesError) throw profilesError;

            // 4. Merge requests with profiles
            const merged = requestsData.map(req => ({
                ...req,
                profiles: profilesData?.find(p => p.id === req.user_id) || null
            }));

            setRequests(merged);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleApprove = async (request: any) => {
        setProcessingId(request.id);
        try {
            // 1. Update request status
            await supabase
                .from("deposit_requests")
                .update({ status: "approved", approved_at: new Date() })
                .eq("id", request.id);

            // 2. Find user's checking account
            const { data: accounts } = await supabase
                .from("accounts")
                .select("id, balance")
                .eq("user_id", request.user_id)
                .eq("type", "Checking")
                .single();

            if (accounts) {
                // 3. Update balance
                const newBalance = accounts.balance + request.amount_usd;
                await supabase
                    .from("accounts")
                    .update({ balance: newBalance })
                    .eq("id", accounts.id);

                // 4. Create transaction record
                await supabase.from("transactions").insert({
                    account_id: accounts.id,
                    user_id: request.user_id,
                    date: new Date().toISOString(),
                    description: `Crypto Deposit Approved: ${request.amount_crypto} ${request.crypto_currency} (${request.network})`,
                    amount: request.amount_usd,
                    type: "credit",
                    category: "Deposit",
                    status: "completed",
                });
            }

            toast({ title: "Deposit Approved", description: `$${request.amount_usd.toFixed(2)} credited to user.` });
            fetchRequests();
        } catch (error) {
            console.error("Approval error:", error);
            toast({ title: "Error", description: "Failed to approve deposit.", variant: "destructive" });
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requestId: string) => {
        setProcessingId(requestId);
        try {
            await supabase
                .from("deposit_requests")
                .update({ status: "rejected" })
                .eq("id", requestId);
            toast({ title: "Deposit Rejected" });
            fetchRequests();
        } catch (error) {
            toast({ title: "Error", description: "Failed to reject.", variant: "destructive" });
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const pendingCount = requests.filter(r => r.status === "pending").length;

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-foreground">Admin: Deposit Approval</h1>
                        <p className="text-muted-foreground">
                            {pendingCount} pending deposit{pendingCount !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif">All Deposit Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {requests.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No deposit requests found.</p>
                        ) : (
                            requests.map((req) => (
                                <div
                                    key={req.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-3"
                                >
                                    <div className="flex items-start gap-3">
                                        {req.status === "pending" && <Clock size={20} className="text-amber-500 shrink-0 mt-0.5" />}
                                        {req.status === "approved" && <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />}
                                        {req.status === "rejected" && <XCircle size={20} className="text-destructive shrink-0 mt-0.5" />}
                                        <div>
                                            <p className="font-medium">
                                                {req.profiles?.first_name} {req.profiles?.last_name} ({req.profiles?.email})
                                            </p>
                                            <p className="text-sm">
                                                {req.amount_crypto} {req.crypto_currency} ({req.network}) → ${req.amount_usd.toFixed(2)} USD
                                            </p>
                                            {req.tx_hash && (
                                                <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                                                    Tx: {req.tx_hash}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(req.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <Badge
                                            variant={
                                                req.status === "approved" ? "default" :
                                                    req.status === "rejected" ? "destructive" : "secondary"
                                            }
                                        >
                                            {req.status}
                                        </Badge>
                                        {req.status === "pending" && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                    onClick={() => handleApprove(req)}
                                                    disabled={processingId === req.id}
                                                >
                                                    {processingId === req.id ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-destructive border-destructive hover:bg-destructive/10"
                                                    onClick={() => handleReject(req.id)}
                                                    disabled={processingId === req.id}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}