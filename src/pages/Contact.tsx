import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import {Phone,  Mail} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
  return (

      <PublicLayout>
      <div className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Contact Our Concierge</h1>
            <p className="text-xl text-secondary-foreground/80 font-light leading-relaxed">
              Experience personalized service. Our relationship managers are available 24/7 to assist you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Direct Support</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Global Concierge</h3>
                      <a
                          href="https://t.me/crestglobalbank"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium mt-1"
                      >
                        Message on Telegram
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">Available 24/7/365</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Secure Email</h3>
                      <p className="text-foreground mt-1">support@crestworldwide.com</p>
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card className="border-border shadow-sm">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Send a Secure Message</h2>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">First Name</label>
                          <Input className="bg-muted/50 border-border h-12" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Last Name</label>
                          <Input className="bg-muted/50 border-border h-12" placeholder="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email Address</label>
                        <Input className="bg-muted/50 border-border h-12" type="email" placeholder="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Subject</label>
                        <Input className="bg-muted/50 border-border h-12" placeholder="How can we help?" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Message</label>
                        <Textarea className="bg-muted/50 border-border min-h-[150px] resize-y" placeholder="Please do not include sensitive account information." />
                      </div>
                      <Button className="w-full md:w-auto px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base">
                        Send Secure Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
          
          {/* FAQ */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center text-foreground mb-10">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "How do I open an international account?", a: "International accounts can be opened entirely online through our secure portal. You will need a valid government-issued ID and proof of residence." },
                { q: "What are your wire transfer fees?", a: "Domestic wire transfers are complimentary for all account tiers. International transfers incur a flat fee of $15, with highly competitive exchange rates." },
                { q: "How do I report a lost or stolen card?", a: "Immediately lock your card via the mobile app or dashboard. Alternatively, call our 24/7 dedicated fraud hotline at 1-800-FED-CREST." },
                { q: "Do you offer wealth management advisory?", a: "Yes. Our Private Wealth division provides bespoke portfolio management, estate planning, and tax strategy for high-net-worth individuals." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
