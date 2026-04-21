import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Shield,
  Home,
  CreditCard,
  List,
  Send,
  Download,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  User as UserIcon,
  ChevronRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setLocation] = useLocation();

  const displayName = profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : user?.email?.split('@')[0] || 'User';

  const initials = displayName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = async () => {
    await signOut();
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/accounts", label: "Accounts", icon: CreditCard },
    { href: "/dashboard/transactions", label: "Transactions", icon: List },
    { href: "/dashboard/send", label: "Send Funds", icon: Send },
    { href: "/dashboard/deposit", label: "Deposit", icon: Download },
    { href: "/dashboard/security", label: "Security", icon: Shield },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const SidebarContent = () => (
      <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        {/* Logo in sidebar */}
        <div className="h-20 flex items-center px-6 border-b border-sidebar-border/50">
          <Logo size="md" withText={sidebarOpen} className="w-full justify-start" />
        </div>

        {/* User profile section */}
        <div className={`p-6 border-b border-sidebar-border/50 flex items-center gap-4 transition-all duration-300 ${sidebarOpen ? "" : "justify-center px-2"}`}>
          <Avatar className="h-10 w-10 border border-sidebar-border bg-sidebar-accent">
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className={`flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"}`}>
            <span className="text-sm font-semibold text-white truncate">{displayName}</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition-colors ${
                        isActive
                            ? "bg-primary text-primary-foreground font-medium shadow-sm"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    } ${sidebarOpen ? "" : "justify-center"}`} data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}>
                      <Icon size={20} className={isActive ? "text-primary-foreground" : ""} />
                      <span className={`text-sm whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}>
                    {item.label}
                  </span>
                    </div>
                  </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <div className="p-4 mt-auto border-t border-sidebar-border/50">
          <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-3 rounded-md text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors w-full ${sidebarOpen ? "" : "justify-center"}`}
              data-testid="button-logout"
          >
            <LogOut size={20} />
            <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}>
            Secure Logout
          </span>
          </button>
        </div>
      </div>
  );

  return (
      <div className="min-h-screen flex bg-muted/30">
        {/* Desktop Sidebar */}
        <motion.aside
            className="hidden md:block sticky top-0 h-screen z-40"
            initial={{ width: 280 }}
            animate={{ width: sidebarOpen ? 280 : 80 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <SidebarContent />
        </motion.aside>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-20 bg-background border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent
                    side="left"
                    className="w-[300px] sm:w-[400px] border-l-border bg-background p-0 [&>button]:text-white [&>button]:w-10 [&>button]:h-10 [&>button]:top-0 [&>button]:right-0 [&>button>svg]:w-5 [&>button>svg]:h-10"
                >
                  <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
                    {/* Logo */}
                    <div className="h-20 flex items-center px-6 border-b border-sidebar-border/50">
                      <Logo size="md" withText={true} className="w-full justify-start" />
                    </div>

                    {/* User Profile */}
                    <div className="p-6 border-b border-sidebar-border/50 flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-sidebar-border bg-sidebar-accent">
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white truncate">{displayName}</span>
                        <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</span>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-6 px-3">
                      <nav className="space-y-1">
                        {navItems.map((item) => {
                          const isActive = location === item.href;
                          const Icon = item.icon;
                          return (
                              <Link key={item.href} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition-colors ${
                                        isActive
                                            ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`}
                                >
                                  <Icon size={20} className={isActive ? "text-primary-foreground" : ""} />
                                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                                </div>
                              </Link>
                          );
                        })}

                        {/* Admin Links (Mobile) */}
                        {profile?.is_admin && (
                            <>
                              <button
                                  onClick={() => setLocation("/admin/deposits")}
                                  className="w-full flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              >
                                <Shield size={20} className="text-amber-500" />
                                <span className="text-sm whitespace-nowrap">Admin: Deposits</span>
                              </button>
                              <button
                                  onClick={() => setLocation("/admin/users")}
                                  className="w-full flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              >
                                <Users size={20} className="text-blue-500" />
                                <span className="text-sm whitespace-nowrap">Admin: Balances</span>
                              </button>
                            </>
                        )}
                      </nav>
                    </div>

                    {/* Logout */}
                    <div className="p-4 mt-auto border-t border-sidebar-border/50">
                      <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-3 rounded-md text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
                      >
                        <LogOut size={20} />
                        <span className="text-sm font-medium whitespace-nowrap">Secure Logout</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sidebar toggle */}
              <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex text-muted-foreground hover:bg-muted"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={20} />
              </Button>

              {/* Search bar */}
              <div className="hidden lg:flex items-center relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                    placeholder="Search transactions, accounts..."
                    className="pl-10 bg-muted border-transparent focus-visible:bg-background focus-visible:ring-1 shadow-none"
                />
              </div>
            </div>

            {/* Right side header items */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="pl-2 pr-4 h-10 border border-border bg-card shadow-sm hidden sm:flex items-center gap-3 rounded-full hover:bg-accent/5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{displayName}</span>
                    <ChevronRight size={14} className="text-muted-foreground ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer w-full flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/security" className="cursor-pointer w-full flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Security Preferences</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Admin Links (Desktop) */}
                  {profile?.is_admin && (
                      <>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setLocation("/admin/deposits")}
                        >
                          <Shield className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Admin: Deposit Approvals</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setLocation("/admin/users")}
                        >
                          <Users className="mr-2 h-4 w-4 text-blue-500" />
                          <span>Admin: User Balances</span>
                        </DropdownMenuItem>
                      </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Secure Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}