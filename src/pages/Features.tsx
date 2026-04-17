import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import {Shield, BarChart3, Smartphone, Lock, Activity, Globe2, Layers, Zap, Globe, CreditCard} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <PublicLayout>
      <div className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Layers size={64} className="mx-auto text-accent mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Platform Capabilities</h1>
            <p className="text-xl text-secondary-foreground/80 font-light leading-relaxed">
              Explore the sophisticated financial tools and infrastructure powering Federal Crest Bank.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground">Advanced Functional Suite</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Designed for uncompromising performance, security, and insight.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
          >
            {[
              {
                icon: Shield,
                title: "Institutional-Grade Protection",
                desc: "256-bit encryption, real-time fraud detection, and FDIC-insured accounts—your assets are protected at every level." },
              {
                icon: Zap, // or Clock, TrendingUp, Rocket
                title: "Instant Crypto Settlements",
                desc: "Execute trades and transfers at network-native speeds—while our multi-sig wallets ensure every transaction is verified." },
              {
                icon: Globe,
                title: "Global Multi-Currency Accounts",
                desc: "Hold, send, and receive USD, EUR, GBP, and BTC seamlessly. No hidden FX markups."
              },
              {
                icon: CreditCard,
                title: "Metal Card with Dynamic CVV",
                desc: "A premium, weighted metal card with a CVV that regenerates every hour to eliminate online fraud."
              }
            ].map((feat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="h-full border-border hover:border-primary/50 transition-colors bg-card hover-elevate">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <feat.icon size={24} />
                    </div>
                    <CardTitle className="font-serif text-xl">{feat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">
                      {feat.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-sm px-10 h-14 text-lg shadow-md">
                Experience Federal Crest
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
