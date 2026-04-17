import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Shield, Clock, Users, Globe2, Award, Building } from "lucide-react";

export default function About() {
  return (
    <PublicLayout>
      <div className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Shield size={48} className="mx-auto text-accent mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Our Legacy of Trust</h1>
            <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto font-light">
              For over 5 years+, Federal Crest Bank has defined the standard for institutional-grade financial services.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Our Mission</h2>
              <h3 className="text-3xl font-serif font-bold mb-6 text-foreground">Preserving Wealth, Advancing Ambition</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Federal Crest Bank was established with a singular focus: to provide absolute financial security while facilitating extraordinary growth for our clients. We navigate the complexities of global finance with unmatched precision and discretion.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our approach combines the prudence of traditional banking with the agility of modern financial technology, ensuring our clients remain at the vanguard of economic opportunity.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, label: "Founded 2021" },
                { icon: Users, label: "675k+ Clients" },
                { icon: Globe2, label: "18+ Countries" },
                { icon: Award, label: "Tier 1 Capital" }
              ].map((stat, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-sm text-center">
                  <stat.icon size={32} className="mx-auto text-primary mb-4" />
                  <span className="font-semibold text-foreground">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Building size={48} className="mx-auto text-primary mb-6" />
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Leadership</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our executive committee comprises industry veterans drawn from the world's leading financial institutions, regulatory bodies, and technology enterprises. Together, they steer Federal Crest Bank with unwavering commitment to our core principles.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
