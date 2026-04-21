import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/supabaseClient";

export default function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [, setLocation] = useLocation();

    // Check if we have a hash with access_token (Supabase puts it there)
    useEffect(() => {
        const hash = window.location.hash;
        if (!hash || !hash.includes("access_token")) {
            setError("Invalid or expired password reset link. Please request a new one.");
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            // Optionally sign out after password change to force re-login
            await supabase.auth.signOut();
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-border shadow-lg rounded-xl p-8 md:p-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Password Updated</h2>
                        <p className="text-muted-foreground mb-8">
                            Your password has been successfully changed. Please sign in with your new password.
                        </p>
                        <Link href="/login">
                            <Button className="w-full h-12">Sign In</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="h-20 border-b border-border bg-card flex items-center justify-between px-6 md:px-12">
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground p-2 rounded-sm">
                        <Shield size={24} className="fill-current" />
                    </div>
                    <span className="font-serif font-bold text-xl tracking-wide text-foreground">CREST GLOBAL</span>
                </Link>
            </header>

            <div className="flex-1 flex items-center justify-center p-6 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background z-0" />

                <div className="w-full max-w-md relative z-10">
                    <div className="bg-card border border-border shadow-lg rounded-xl p-8 md:p-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Set New Password</h1>
                                <p className="text-muted-foreground text-sm">
                                    Enter a new secure password for your account.
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
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-12 bg-muted/50"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Update Password"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>

                    <div className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Shield size={14} /> Protected by 256-bit Encryption
                    </div>
                </div>
            </div>
        </div>
    );
}