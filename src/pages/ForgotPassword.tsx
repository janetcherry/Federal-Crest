import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      // For security, we show success even if the email doesn't exist
      // (Supabase returns success anyway for non-existent emails)
      if (error) {
        // Only show error for rate limiting or invalid format
        if (error.message.includes("rate limit") || error.message.includes("valid email")) {
          setError(error.message);
          setStatus("idle");
          return;
        }
      }

      // Success - show confirmation
      setStatus("success");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setStatus("idle");
    }
  };

  return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-20 border-b border-border bg-card flex items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-sm">
              <Shield size={24} className="fill-current" />
            </div>
            <span className="font-serif font-bold text-xl tracking-wide text-foreground">CREST GLOBAL</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Return to Login
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background z-0" />

          <div className="w-full max-w-md relative z-10">
            <div className="bg-card border border-border shadow-lg rounded-xl p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status !== "success" ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-8">
                        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Password Recovery</h1>
                        <p className="text-muted-foreground text-sm">
                          Enter your email address and we'll send you a secure link to reset your password.
                        </p>
                      </div>

                      {error && (
                          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                            <AlertCircle size={20} className="text-destructive shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive">{error}</p>
                          </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="h-12 bg-muted/50"
                          />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                            disabled={status === "loading" || !email}
                        >
                          {status === "loading" ? "Sending..." : (
                              <>Send Reset Link <ArrowRight size={16} className="ml-2" /></>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-center py-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={32} />
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Check Your Email</h2>
                      <p className="text-muted-foreground mb-8">
                        We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                        Click the link in the email to reset your password.
                      </p>
                      <p className="text-xs text-muted-foreground mb-6">
                        Didn't receive it? Check your spam folder or try again.
                      </p>

                      <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full h-12"
                            onClick={() => {
                              setStatus("idle");
                              setError(null);
                            }}
                        >
                          Try a different email
                        </Button>
                        <Link href="/login">
                          <Button className="w-full h-12">
                            Return to Secure Login
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Shield size={14} /> Protected by 256-bit Encryption
            </div>
          </div>
        </div>
      </div>
  );
}
