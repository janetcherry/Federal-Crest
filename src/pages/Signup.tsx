import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, AlertCircle, Eye, EyeOff, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/supabaseClient.ts";
import { Logo } from "@/components/Logo.tsx";

// Password strength regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function Signup() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form state – added accountType and coOwnerName
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    accountType: "single",      // "single" or "joint"
    coOwnerName: "",            // only used if joint
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError(null);
  };

  const validatePassword = (password: string): boolean => {
    return PASSWORD_REGEX.test(password);
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (password.length === 0) return { score: 0, label: "", color: "bg-muted" };
    if (password.length < 8) return { score: 1, label: "Too short", color: "bg-destructive" };

    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score <= 2) return { score: 2, label: "Weak", color: "bg-destructive" };
    if (score === 3) return { score: 3, label: "Medium", color: "bg-amber-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError("Please fill in all required fields.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      // Validate co-owner name if joint account selected
      if (formData.accountType === "joint" && !formData.coOwnerName.trim()) {
        setError("Please enter the co-owner's full name.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        setError("Please complete all security fields.");
        return;
      }
      if (!validatePassword(formData.password)) {
        setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@$!%*?&).");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step < 3) {
      handleNext();
      return;
    }

    if (!formData.street || !formData.city || !formData.state || !formData.zip || !formData.country) {
      setError("Please complete all address fields.");
      return;
    }

    setIsLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          account_type: formData.accountType,
          co_owner_name: formData.accountType === "joint" ? formData.coOwnerName : null,
          is_admin: false,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
          },
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    // ✅ Insert the profile row – this fires the trigger that creates accounts
    if (data.user) {
      const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            account_type: formData.accountType,
            co_owner_name: formData.accountType === "joint" ? formData.coOwnerName : null,
          });

      if (profileError) {
        console.error("Profile insert error:", profileError);
        // Even if profile insert fails, the user is created – we can let the use‑auth fallback handle it later.
      }
    }

    setLocation("/login?signup=success");
  };  return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-20 border-b border-border bg-card flex items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="sm" withText={false} />
            <span className="font-serif font-bold text-xl tracking-wide text-foreground">CREST GLOBAL</span>
          </Link>
          <div className="text-sm font-medium text-muted-foreground hidden sm:block">
            Secure Application Portal
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background z-0" />

          <div className="w-full max-w-lg relative z-10">
            <div className="mb-12">
              <div className="flex justify-between mb-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`text-xs font-semibold uppercase tracking-wider ${step >= i ? 'text-primary' : 'text-muted-foreground'}`}>
                      Step 0{i}
                    </div>
                ))}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "33%" }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
                />
              </div>
            </div>

            <div className="bg-card border border-border shadow-lg rounded-xl p-8 md:p-10">
              <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                      <AlertCircle size={20} className="text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                  {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Personal Information</h2>
                          <p className="text-muted-foreground">Let's start with your basic details to verify your identity.</p>
                        </div>

                        {/* Account Type Selection */}
                        <div className="space-y-3">
                          <Label>Account Type</Label>
                          <RadioGroup
                              defaultValue="single"
                              value={formData.accountType}
                              onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                              className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="single" id="single" />
                              <Label htmlFor="single" className="cursor-pointer">Single Account</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="joint" id="joint" />
                              <Label htmlFor="joint" className="cursor-pointer">Joint Account</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" value={formData.firstName} onChange={handleChange} required className="h-12 bg-muted/50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" value={formData.lastName} onChange={handleChange} required className="h-12 bg-muted/50" />
                          </div>
                        </div>

                        {/* Co-Owner Name (conditional) */}
                        {formData.accountType === "joint" && (
                            <div className="space-y-2">
                              <Label htmlFor="coOwnerName">Co-Owner Full Name</Label>
                              <Input
                                  id="coOwnerName"
                                  value={formData.coOwnerName}
                                  onChange={handleChange}
                                  placeholder="e.g. Jane Smith"
                                  required={formData.accountType === "joint"}
                                  className="h-12 bg-muted/50"
                              />
                            </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="h-12 bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required className="h-12 bg-muted/50" />
                        </div>
                      </motion.div>
                  )}

                  {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Account Security</h2>
                          <p className="text-muted-foreground">Create a strong password to protect your account.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="h-12 bg-muted/50 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>

                          {formData.password && (
                              <div className="mt-2 space-y-1">
                                <div className="flex gap-1">
                                  <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-muted'}`} />
                                  <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-muted'}`} />
                                  <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-muted'}`} />
                                  <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-muted'}`} />
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-xs text-muted-foreground">
                                    {passwordStrength.label && `${passwordStrength.label} password`}
                                  </p>
                                  <div className="flex gap-2 text-xs">
                                    <span className={formData.password.length >= 8 ? "text-emerald-500" : "text-muted-foreground"}>8+</span>
                                    <span className={/[A-Z]/.test(formData.password) ? "text-emerald-500" : "text-muted-foreground"}>A</span>
                                    <span className={/[a-z]/.test(formData.password) ? "text-emerald-500" : "text-muted-foreground"}>a</span>
                                    <span className={/\d/.test(formData.password) ? "text-emerald-500" : "text-muted-foreground"}>1</span>
                                    <span className={/[@$!%*?&]/.test(formData.password) ? "text-emerald-500" : "text-muted-foreground"}>@</span>
                                  </div>
                                </div>
                              </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="h-12 bg-muted/50 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                              <p className="text-xs text-destructive">Passwords do not match</p>
                          )}
                        </div>
                      </motion.div>
                  )}

                  {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Residential Address</h2>
                          <p className="text-muted-foreground">Required by global financial regulations for account creation.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input id="street" value={formData.street} onChange={handleChange} required className="h-12 bg-muted/50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" value={formData.city} onChange={handleChange} required className="h-12 bg-muted/50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State / Province</Label>
                            <Input id="state" value={formData.state} onChange={handleChange} required className="h-12 bg-muted/50" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="zip">Postal / ZIP Code</Label>
                            <Input id="zip" value={formData.zip} onChange={handleChange} required className="h-12 bg-muted/50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" value={formData.country} onChange={handleChange} required className="h-12 bg-muted/50" />
                          </div>
                        </div>
                      </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between mt-10 pt-6 border-t border-border">
                  {step > 1 ? (
                      <Button type="button" variant="outline" onClick={handlePrev} className="h-12 px-6">
                        <ChevronLeft size={16} className="mr-2" /> Back
                      </Button>
                  ) : (
                      <div />
                  )}
                  <Button type="submit" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md ml-auto" disabled={isLoading}>
                    {isLoading ? (
                        "Processing..."
                    ) : step === 3 ? (
                        <>Complete Application <Check size={16} className="ml-2" /></>
                    ) : (
                        <>Continue <ChevronRight size={16} className="ml-2" /></>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            <div className="text-center mt-8 text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
  );
}