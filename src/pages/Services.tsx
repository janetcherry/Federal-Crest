import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Building2, LineChart, Briefcase, Landmark, Globe, Diamond } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      icon: Building2,
      title: "Personal Banking",
      desc: "Checking and savings accounts tailored for discerning individuals, offering competitive yields and seamless digital access."
    },
    {
      icon: Briefcase,
      title: "Business Banking",
      desc: "Robust treasury management, payroll processing, and commercial lending solutions for enterprises of scale."
    },
    {
      icon: LineChart,
      title: "Investment Management",
      desc: "Institutional-grade portfolio construction utilizing proprietary algorithmic models and global macroeconomic insights."
    },
    {
      icon: Landmark,
      title: "Lending & Mortgages",
      desc: "Bespoke credit solutions including jumbo mortgages, Lombard loans, and structured corporate finance."
    },
    {
      icon: Globe,
      title: "International Transfers",
      desc: "Frictionless cross-border capital movement via our secure, high-speed SWIFT integrated network."
    },
    {
      icon: Diamond,
      title: "Wealth Management",
      desc: "Comprehensive estate planning, trust services, and generational wealth preservation strategies."
    }
  ];

  return (
    <PublicLayout>
      <div className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Landmark size={64} className="mx-auto text-accent mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Our Services</h1>
            <p className="text-xl text-secondary-foreground/80 font-light leading-relaxed">
              Comprehensive financial solutions crafted for preservation, growth, and absolute control.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-border bg-card hover:border-primary/50 transition-colors group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <service.icon size={28} />
                    </div>
                    <CardTitle className="font-serif text-2xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between flex-1">
                    <CardDescription className="text-base text-muted-foreground leading-relaxed mb-8">
                      {service.desc}
                    </CardDescription>
                    <Link href="/contact">
                      <Button variant="link" className="px-0 text-primary hover:text-primary/80 font-medium">
                        Learn More →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-muted py-24 border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Require a Specialized Solution?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our advisory team is prepared to architect custom financial structures to meet complex global requirements.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
              Contact an Advisor
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
