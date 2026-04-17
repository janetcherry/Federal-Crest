import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Key, Smartphone, History, AlertTriangle, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export default function DashboardSecurity() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [loginActivity, setLoginActivity] = useState<any[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isFreezing, setIsFreezing] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  useEffect(() => {
    if (user) {
      fetchLoginActivity();
    }
  }, [user]);

  const fetchLoginActivity = async () => {
    const { data, error } = await supabase
        .from("login_activity")
        .select("*")
        .eq("user_id", user!.id)
        .order("login_time", { ascending: false })
        .limit(10);
    if (!error) setLoginActivity(data || []);
    setIsLoadingActivity(false);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (passwordForm.new.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new
      });
      if (error) throw error;
      toast({ title: "Success", description: "Password updated successfully." });
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleFreezeAccount = async () => {
    if (!profile) return;
    setIsFreezing(true);
    try {
      const { error } = await supabase
          .from("profiles")
          .update({ frozen: true })
          .eq("id", user!.id);
      if (error) throw error;
      toast({ title: "Account Frozen", description: "Your account has been temporarily frozen. Contact support to unfreeze." });
      // Optionally sign out after freezing
      await signOut();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsFreezing(false);
    }
  };

  const getLocationFromUserAgent = (ua: string) => {
    // Simple mock – in production you'd use a geo IP service
    return "Unknown";
  };

  const getDeviceFromUserAgent = (ua: string) => {
    if (ua.includes("Mac")) return "Mac OS • Safari";
    if (ua.includes("Windows")) return "Windows • Chrome";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS • Mobile";
    if (ua.includes("Android")) return "Android • Mobile";
    return "Unknown Device";
  };

  return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Security Center</h1>
            <p className="text-muted-foreground">Manage your account protection and authentication settings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <History className="text-primary" size={20} />
                    <CardTitle className="font-serif">Recent Login Activity</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingActivity ? (
                      <div className="py-8 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                  ) : loginActivity.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">No login activity recorded.</div>
                  ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-transparent hover:bg-transparent">
                            <TableHead>Device / Location</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loginActivity.map((entry) => (
                              <TableRow key={entry.id}>
                                <TableCell>
                                  <div className="font-medium">{getDeviceFromUserAgent(entry.user_agent)}</div>
                                  <div className="text-xs text-muted-foreground">{getLocationFromUserAgent(entry.user_agent)}</div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{entry.ip_address || "—"}</TableCell>
                                <TableCell className="text-sm">{new Date(entry.login_time).toLocaleString()}</TableCell>
                                <TableCell>
                                  {entry.status === 'success' ? (
                                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none">
                                        <CheckCircle size={12} className="mr-1" /> Success
                                      </Badge>
                                  ) : (
                                      <Badge variant="destructive">
                                        <XCircle size={12} className="mr-1" /> Failed
                                      </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="text-foreground" size={20} />
                    <CardTitle className="font-serif">Change Password</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                      className="w-full"
                      onClick={handlePasswordChange}
                      disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Update Password
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="text-destructive mt-1 shrink-0" size={24} />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Account Lockout</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {profile?.frozen
                            ? "Your account is currently frozen. Contact support to reactivate."
                            : "Temporarily freeze all account activities if you suspect fraud."}
                      </p>
                      <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleFreezeAccount}
                          disabled={isFreezing || profile?.frozen}
                      >
                        {isFreezing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {profile?.frozen ? "Account Frozen" : "Freeze Account"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
  );
}