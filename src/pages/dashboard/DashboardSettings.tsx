import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { User, Bell, Globe, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export default function DashboardSettings() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    language: "en",
    timezone: "est",
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    alert_large_deposits: true,
    alert_large_withdrawals: true,
    alert_international: true,
  });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        email: user?.email || "",
        language: profile.language || "en",
        timezone: profile.timezone || "est",
        email_notifications: profile.email_notifications ?? true,
        push_notifications: profile.push_notifications ?? true,
        sms_notifications: profile.sms_notifications ?? false,
        alert_large_deposits: profile.alert_large_deposits ?? true,
        alert_large_withdrawals: profile.alert_large_withdrawals ?? true,
        alert_international: profile.alert_international ?? true,
      });
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
          .from("profiles")
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            language: formData.language,
            timezone: formData.timezone,
            email_notifications: formData.email_notifications,
            push_notifications: formData.push_notifications,
            sms_notifications: formData.sms_notifications,
            alert_large_deposits: formData.alert_large_deposits,
            alert_large_withdrawals: formData.alert_large_withdrawals,
            alert_international: formData.alert_international,
          })
          .eq("id", user.id);

      if (error) throw error;

      toast({ title: "Success", description: "Your settings have been saved." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = `${formData.first_name} ${formData.last_name}`.trim() || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Preferences & Settings</h1>
            <p className="text-muted-foreground">Manage your personal profile and account preferences.</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="text-primary" size={20} />
                    <CardTitle className="font-serif">Personal Information</CardTitle>
                  </div>
                  <CardDescription>Update your contact details and public profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-2 border-border bg-muted">
                      <AvatarFallback className="text-2xl font-serif font-bold bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" disabled>Change Photo</Button>
                      <p className="text-xs text-muted-foreground">Avatar based on your initials.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                          value={formData.first_name}
                          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                          className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                          value={formData.last_name}
                          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                          className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input value={formData.email} disabled className="bg-muted/30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          type="tel"
                          className="bg-muted/50"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border bg-muted/10 p-6 flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="text-primary" size={20} />
                    <CardTitle className="font-serif">Alert Preferences</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Transaction Alerts</h3>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <div>
                        <p className="text-sm font-medium">Large Deposits</p>
                        <p className="text-xs text-muted-foreground">Notify when receiving &gt; $1,000</p>
                      </div>
                      <Switch
                          checked={formData.alert_large_deposits}
                          onCheckedChange={(checked) => setFormData({...formData, alert_large_deposits: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <div>
                        <p className="text-sm font-medium">Large Withdrawals</p>
                        <p className="text-xs text-muted-foreground">Notify on any withdrawal &gt; $500</p>
                      </div>
                      <Switch
                          checked={formData.alert_large_withdrawals}
                          onCheckedChange={(checked) => setFormData({...formData, alert_large_withdrawals: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <div>
                        <p className="text-sm font-medium">International Transactions</p>
                        <p className="text-xs text-muted-foreground">Notify on any cross-border activity</p>
                      </div>
                      <Switch
                          checked={formData.alert_international}
                          onCheckedChange={(checked) => setFormData({...formData, alert_international: checked})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="font-medium text-foreground">Delivery Methods</h3>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Email Notifications</span>
                      <Switch
                          checked={formData.email_notifications}
                          onCheckedChange={(checked) => setFormData({...formData, email_notifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Push Notifications (Mobile App)</span>
                      <Switch
                          checked={formData.push_notifications}
                          onCheckedChange={(checked) => setFormData({...formData, push_notifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">SMS Text Messages</span>
                      <Switch
                          checked={formData.sms_notifications}
                          onCheckedChange={(checked) => setFormData({...formData, sms_notifications: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border bg-muted/10 p-6 flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-6 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="text-primary" size={20} />
                    <CardTitle className="font-serif">Regional & Display</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={formData.language} onValueChange={(val) => setFormData({...formData, language: val})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English (US)</SelectItem>
                          <SelectItem value="uk">English (UK)</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={formData.timezone} onValueChange={(val) => setFormData({...formData, timezone: val})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">Eastern Time (ET)</SelectItem>
                          <SelectItem value="cst">Central Time (CT)</SelectItem>
                          <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border bg-muted/10 p-6 flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
  );
}