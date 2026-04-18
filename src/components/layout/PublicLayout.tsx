import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Phone, Mail, HelpCircle, X} from "lucide-react";
import { Button } from "@/components/ui/button";
import {Sheet, SheetClose, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";

export function PublicLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/services", label: "Services" },
    { href: "/security", label: "Security" },
    { href: "/contact", label: "Contact" },
  ];

  return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        {/* Utility Bar */}
        <div className="bg-secondary text-secondary-foreground text-xs py-2 px-4 md:px-8 flex justify-between items-center hidden md:flex">
          <div className="flex space-x-6 items-center">
            <span className="flex items-center gap-1.5 font-medium"><Phone size={12} className="text-accent" /> 1-800-FED-CREST</span>
            <span className="flex items-center gap-1.5 opacity-80"><Mail size={12} /> support@federalcrestbank.com</span>
            <Link href="/contact">
              <span className="flex items-center gap-1.5 opacity-80"><HelpCircle size={12} /> How can we help you?</span>
            </Link>
          </div>
          <div className="flex space-x-4 items-center">

            <Link href="/login" className="flex items-center gap-1.5 text-accent font-medium hover:text-accent/80 transition-colors">
              <Logo size="sm" withText={false} /> Secure Login
            </Link>
          </div>
        </div>

        {/* Primary Navigation */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border w-full">
          <div className="container mx-auto px-4 md:px-8 h-17 flex items-center justify-between">
            {/* Deep blue text for public header */}
            <Logo size="md" textClassName="text-blue-950 dark:text-blue-400" className="shrink-0" />

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                  <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary border-b-2 border-primary py-7" : "text-muted-foreground py-7"}`}
                  >
                    {link.label}
                  </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-sm px-6 shadow-sm">Open Account</Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-border bg-background p-0">
                <div className="flex flex-col h-full">
                  {/* Header with Logo and Close Button */}
                  <div className="p-6 border-b border-border bg-secondary text-secondary-foreground">
                    <div className="flex items-center justify-between mb-6">
                      <Logo size="md" textClassName="text-blue-900 dark:text-blue-400" withText={true} />
                      {/* Explicit close button – visible on all backgrounds */}
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="text-secondary-foreground hover:bg-secondary-foreground/10">
                          <X size={20} />
                        </Button>
                      </SheetClose>
                    </div>
                    <Link href="/login" className="w-full mb-3">
                      <Button variant="outline" className="w-full justify-start bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/20 hover:text-secondary-foreground">
                        <Logo size="sm" withText={false} className="mr-2" /> Secure Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Open Account
                      </Button>
                    </Link>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`p-4 rounded-md text-base font-medium transition-colors ${
                                location === link.href
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
                                    : "text-foreground hover:bg-muted"
                            }`}
                        >
                          {link.label}
                        </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-secondary text-secondary-foreground border-t border-border pt-16 pb-8">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
              <div className="lg:col-span-2">
                {/* Deep blue text in footer as well */}
                <Logo size="lg" textClassName="text-blue-900 dark:text-blue-400" className="mb-6" />
                <p className="text-sm opacity-80 mb-6 max-w-sm leading-relaxed">
                  A prestigious international banking institution providing secure, reliable, and trusted financial services since 1898.
                </p>
                <div className="flex items-center gap-4 text-accent">
                  <Logo size="sm" withText={false} />
                  <span className="text-sm font-medium">256-bit AES Encryption</span>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-semibold text-lg mb-6 text-white">Banking</h4>
                <ul className="space-y-4 text-sm opacity-80">
                  <li><Link href="/services" className="hover:text-accent transition-colors">Checking Accounts</Link></li>
                  <li><Link href="/services" className="hover:text-accent transition-colors">Savings Accounts</Link></li>
                  <li><Link href="/services" className="hover:text-accent transition-colors">Credit Cards</Link></li>
                  <li><Link href="/services" className="hover:text-accent transition-colors">Loans & Mortgages</Link></li>
                  <li><Link href="/services" className="hover:text-accent transition-colors">Wealth Management</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-semibold text-lg mb-6 text-white">Institution</h4>
                <ul className="space-y-4 text-sm opacity-80">
                  <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                  <li><Link href="/about" className="hover:text-accent transition-colors">Leadership</Link></li>
                  <li><Link href="/contact" className="hover:text-accent transition-colors">Careers</Link></li>
                  <li><Link href="/contact" className="hover:text-accent transition-colors">Investor Relations</Link></li>
                  <li><Link href="/contact" className="hover:text-accent transition-colors">Newsroom</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-semibold text-lg mb-6 text-white">Support</h4>
                <ul className="space-y-4 text-sm opacity-80">
                  <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                  <li><Link href="/contact" className="hover:text-accent transition-colors">Branch Locator</Link></li>
                  <li><Link href="/security" className="hover:text-accent transition-colors">Security Center</Link></li>
                  <li><Link href="/contact" className="hover:text-accent transition-colors">Help & FAQs</Link></li>
                  <li><Link href="/contact" className="hover:text-accent transition-colors">Report Fraud</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
              <p>&copy; {new Date().getFullYear()} Federal Crest Bank. All rights reserved. Member FDIC. Equal Housing Lender.</p>
              <div className="flex space-x-6">
                <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Accessibility</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}