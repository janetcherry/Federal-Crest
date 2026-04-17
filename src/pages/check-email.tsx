import { PublicLayout } from "@/components/layout/PublicLayout";
import {Link} from "wouter";

export default function CheckEmail() {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email") || "your email";

    return (
        <PublicLayout>

        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
                <p className="text-muted-foreground mb-6">
                    We've sent a confirmation link to <strong>{email}</strong>.
                    Click the link to activate your account.
                </p>
                <Link href="/login" className="text-primary hover:underline">
                    Return to Sign In
                </Link>
            </div>
        </div>
        </PublicLayout>
            );
}