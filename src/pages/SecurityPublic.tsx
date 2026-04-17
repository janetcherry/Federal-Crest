import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Shield, Fingerprint, Lock, FileKey, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SecurityPublic() {
  return (
    <PublicLayout>
      <div className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Shield size={64} className="mx-auto text-primary mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Uncompromising Security</h1>
            <p className="text-xl text-secondary-foreground/80 font-light leading-relaxed">
              Your assets are protected by the world's most advanced cryptographic protocols and institutional safeguards.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "256-Bit AES Encryption",
                description: "Military-grade encryption protects your data at rest and in transit, ensuring complete privacy."
              },
              {
                icon: Fingerprint,
                title: "Biometric Authentication",
                description: "Advanced identity verification utilizing facial recognition, fingerprint, and voice biometrics."
              },
              {
                icon: AlertTriangle,
                title: "Predictive Fraud Prevention",
                description: "AI-driven behavioral analytics detect and neutralize threats before they materialize."
              },
              {
                icon: FileKey,
                title: "Multi-Factor Access",
                description: "Hardware token support and time-based one-time passwords for unparalleled access control."
              },
              {
                icon: Shield,
                title: "Asset Segregation",
                description: "Client assets are strictly segregated from institutional funds in deeply protected offline vaults."
              },
              {
                icon: CheckCircle2,
                title: "Regulatory Compliance",
                description: "Strict adherence to international financial regulations, including GDPR, CCPA, and PSD2."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-border bg-card hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-sm bg-muted flex items-center justify-center mb-4 text-foreground">
                      <feature.icon size={24} />
                    </div>
                    <CardTitle className="font-serif text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 pt-16 border-t border-border text-center">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-8">Global Certifications</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {["ISO 27001", "SOC 2 Type II", "PCI DSS Level 1", "FINRA Approved", "FDIC Insured"].map((cert, i) => (
                <Badge key={i} variant="outline" className="px-6 py-3 text-sm font-medium border-border text-foreground bg-muted/30">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
