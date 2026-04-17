import {easeInOut, motion, Variants} from "framer-motion";
import { Link } from "wouter";
import { Shield, ArrowRight, Lock, BarChart3, Smartphone, Clock, Globe2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";


const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeInOut,
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-secondary text-secondary-foreground overflow-hidden py-24 lg:py-32 xl:py-40">
        {/* Background layers (unchanged) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F1C2E_0%,transparent_100%)] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-secondary to-secondary z-0" />
          <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-20">
          {/* Flex container for two-column layout */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
            {/* Left column: main hero content (unchanged) */}
            <div className="flex-1 lg:max-w-3xl">
              <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="space-y-6"
              >
                <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                  <Shield size={14} className="text-accent" />
                  <span className="text-xs font-medium tracking-wide uppercase text-white">Online Banking Excellence</span>
                </motion.div>

                <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] tracking-tight">
                  Secure. Reliable.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Trusted Banking.</span>
                </motion.h1>

                <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl leading-relaxed font-light">
                  Experience institutional-grade financial services designed for the modern era. Uncompromising security meets unparalleled elegance.
                </motion.p>

                <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-4 pt-4">

                  <Link href="/signup">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-sm px-8 h-14 text-base shadow-[0_0_20px_rgba(139,0,0,0.4)] transition-all hover:shadow-[0_0_30px_rgba(139,0,0,0.6)]">
                      Open Account
                    </Button>
                  </Link>

                  <Link href="/about">
                    <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-sm px-8 h-14 text-base bg-transparent">
                      Discover Our Legacy
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right column: added promotional card */}
            <div className="w-full lg:w-auto lg:flex-shrink-0 lg:mt-1  xl:mt-1 mb-20 h-70 rounded-2xl items-center">
              <div className="bg-blue-950 text-white rounded-2xl p-8 max-w-md w-full shadow-lg">

                {/* Header */}
                <p className="text-xs tracking-widest uppercase text-blue-200 mb-4">
                  Personal Banking
                </p>

                {/* Title */}
                <h2 className="text-3xl font-semibold leading-tight mb-4">
          <span className="text-blue-100">
            Accounts that work together to{" "}
          </span>
                  <span className="font-bold text-white">
            reward you more
          </span>
                </h2>

                {/* Description */}
                <p className="text-blue-200 mb-6">
                  Bring your checking and savings together — and start
                  earning more from day one.
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-4">

                  {/* Primary Button */}
                  <a
                      href="/signup"
                      className="bg-white text-blue-900 text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Open Checking & Savings
                  </a>

                  {/* Secondary Button */}
                  <a
                      href="/about"
                      className="border border-white text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-white hover:text-blue-900 transition"
                  >
                    See our partnership
                  </a>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Decorative Shield element (unchanged) */}
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="absolute -right-20 -bottom-20 md:right-0 md:top-20 z-10 opacity-30 md:opacity-50 pointer-events-none"
        >
          <Shield size={400} className="text-primary mix-blend-overlay" />
        </motion.div>
      </section>




      {/* Stats Section */}
      <section className="bg-card border-b border-border py-12 relative z-30 -mt-8 mx-4 md:mx-8 rounded-sm shadow-xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
            {[
              { label: "Active Users", value: "675k+" },
              { label: "Years of Service", value: "5+" },
              { label: "Transactions", value: "1.2m+" },
              { label: "Global Reach", value: "18+" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center px-4"
              >
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Institutional Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Engineered for Excellence</h3>
            <p className="text-lg text-muted-foreground">Comprehensive financial tools protected by enterprise-grade security architecture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Operations",
                description: "Military-grade 256-bit encryption protects every transaction and interaction."
              },
              {
                icon: BarChart3,
                title: "Real-time Monitoring",
                description: "Advanced analytics and instant alerts keep you informed of all account activity."
              },
              {
                icon: Lock,
                title: "Account Management",
                description: "Sophisticated controls with multi-factor authentication and role-based access."
              },
              {
                icon: Smartphone,
                title: "Smart Financial Tools",
                description: "Intuitive interfaces designed to simplify complex wealth management tasks."
              },
              {
                icon: Clock,
                title: "Fast System Response",
                description: "High-frequency trading infrastructure ensures zero-latency execution."
              },
              {
                icon: Globe2,
                title: "Global Connectivity",
                description: "Seamless international transfers with competitive rates and instant settlement."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border border-border hover:border-primary/50 transition-colors hover-elevate group bg-card">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-sm bg-muted flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-foreground">
                      <feature.icon size={24} />
                    </div>
                    <CardTitle className="font-serif text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split About Section */}
      <section className="bg-muted py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 md:p-24 lg:p-32 flex flex-col justify-center bg-secondary text-secondary-foreground relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-xl mx-auto lg:mx-0"
            >
              <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-4">Our Heritage</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">Over a Year of Unwavering Trust</h3>
              <p className="text-lg text-secondary-foreground/80 mb-8 font-light leading-relaxed">
                Since our founding, Federal Crest Bank has stood as a bastion of financial stability. We blend centuries-old banking principles with cutting-edge technological infrastructure to serve the world's most discerning clients.
              </p>
              <Link href="/about">
                <Button variant="link" className="text-accent hover:text-white p-0 h-auto font-medium text-base group">
                  Explore Our History <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <div className="bg-card p-12 md:p-24 lg:p-32 flex flex-col justify-center relative">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto lg:mx-0"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-8">
                <Lock size={32} />
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">Security as a Foundation, Not a Feature.</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our proprietary security architecture exceeds global regulatory standards. Every account is protected by multi-layered encryption, behavioral analytics, and biological authentication protocols.
              </p>
              <ul className="space-y-4 mb-8">
                {["SOC 2 Type II Certified", "ISO 27001 Compliant", "PCI DSS Accredited", "Biometric Authentication Standard"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Shield size={12} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/security">
                <Button variant="outline" className="rounded-sm border-border hover:bg-muted text-foreground">
                  View Security Protocols
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Shield size={48} className="mx-auto text-primary mb-6" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Ready to Experience True Banking?</h2>
            <p className="text-xl text-muted-foreground mb-10">Join the world's most secure financial institution today.</p>
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-sm px-10 h-14 text-lg shadow-lg">
                Open Your Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
