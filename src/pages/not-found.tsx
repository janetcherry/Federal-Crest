
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Shield size={48} className="text-primary" />
            </div>
          </div>
          <h1 className="text-6xl font-serif font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved. Let's get
            you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="gap-2">
              <Link href="/">
                <Home size={16} /> Return Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/dashboard">
                <ArrowLeft size={16} /> Go to Dashboard
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
  );
}