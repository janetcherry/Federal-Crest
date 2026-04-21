import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, Eye, EyeOff, Loader2, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/hooks/use-auth";
import {Logo} from "@/components/Logo.tsx";
import { useTranslation } from 'react-i18next';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().default(false),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Redirect only when auth is fully loaded and user is authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && !shouldRedirect) {
      setShouldRedirect(true);
      setLocation("/dashboard", { replace: true });
    }
  }, [authLoading, isAuthenticated, shouldRedirect, setLocation]);

  // Check for email confirmation / signup success
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      setSuccessMessage("Email confirmed successfully! You can now sign in.");
      window.history.replaceState(null, "", window.location.pathname);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("signup") === "success") {
      setSuccessMessage("Account created! Please check your email to confirm your email.");
    }
  }, []);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        if (signInError.message.includes("Email not confirmed")) {
          setError("Please confirm your email address before signing in.");
        } else if (signInError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(signInError.message);
        }
        setIsSubmitting(false);
        return;
      }

      // ✅ Log successful sign-in
      if (data?.user) {
        // Get client IP (optional – uses a free public API)
        let ipAddress = "unknown";
        try {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          ipAddress = ipData.ip;
        } catch (ipErr) {
          console.warn("Could not fetch IP address:", ipErr);
        }

        // Call the RPC function to log activity
        await supabase.rpc("log_signin", {
          user_id: data.user.id,
          ip: ipAddress,
          user_agent: navigator.userAgent,
        });
      }

      // Auth successful – the useEffect will handle redirect
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  }
  // Show loading spinner while auth is initializing OR redirect is pending
  if (authLoading || shouldRedirect) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }


  return (
      <div className="min-h-screen flex flex-col md:flex-row bg-background">
        {/* Left side - Branding */}
        <div className="hidden md:flex w-1/2 bg-secondary text-secondary-foreground flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-0" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <Logo size="lg" withText={false} />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl leading-none text-white tracking-wide">CREST GLOBAL</span>
                <span className="text-xs tracking-widest text-accent uppercase font-medium">Bank & Trust</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">Secure. Private. Institutional.</h2>
            <p className="text-lg text-white/80 font-light leading-relaxed">
              Access your wealth management portal protected by our enterprise-grade security architecture.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-white/60 text-sm">
            <Lock size={16} />
            <span>Protected by 256-bit AES Encryption</span>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
          <Link href="/" className="absolute top-6 left-6 md:hidden flex items-center gap-2">
            <Shield size={24} className="text-primary" />
            <span className="font-serif font-bold text-foreground">CREST GLOBAL</span>
          </Link>

          <div className="w-full max-w-md mt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Login</h1>
                <p className="text-muted-foreground">Enter your credentials to access your account.</p>
              </div>

              {/* Success Message */}
              {successMessage && (
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-3">
                    <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">{successMessage}</p>
                  </div>
              )}

              {/* Error Message */}
              {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                    <AlertCircle size={20} className="text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Email Address</FormLabel>
                            <FormControl>
                              <Input
                                  placeholder="Enter your email"
                                  type="email"
                                  {...field}
                                  className="bg-muted/50 border-border h-12 focus-visible:ring-primary"
                                  data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel className="text-foreground">Password</FormLabel>
                              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80">
                                Forgot password?
                              </Link>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...field}
                                    className="bg-muted/50 border-border h-12 focus-visible:ring-primary pr-10"
                                    data-testid="input-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-1">
                            <FormControl>
                              <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-remember"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground cursor-pointer">
                                Remember this device
                              </FormLabel>
                            </div>
                          </FormItem>
                      )}
                  />

                  <Button
                      type="submit"
                      className="w-full h-12 text-base font-medium shadow-md"
                      disabled={isSubmitting}
                      data-testid="button-login"
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In to Dashboard"}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-medium hover:text-primary/80">
                  Open an Account
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
  );
}