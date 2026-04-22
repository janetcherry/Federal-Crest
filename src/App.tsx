import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Services from "@/pages/Services";
import SecurityPublic from "@/pages/SecurityPublic";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/not-found";

// Dashboard Pages
import DashboardHome from "@/pages/dashboard/DashboardHome.tsx";
import Accounts from "@/pages/dashboard/Accounts.tsx";
import Transactions from "@/pages/dashboard/Transactions";
import SendFunds from "@/pages/dashboard/SendFunds";
import Deposit from "@/pages/dashboard/Deposit";
import DashboardSecurity from "@/pages/dashboard/DashboardSecurity";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import UpdatePassword from "@/pages/UpdatePassword.tsx";
import {AdminRoute} from "@/components/auth/AdminRoute.tsx";
import DepositApproval from "@/pages/admin/DepositApproval.tsx";
import UserManagement from "@/pages/admin/UserManagement.tsx";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/features" component={Features} />
      <Route path="/services" component={Services} />
      <Route path="/security" component={SecurityPublic} />
      <Route path="/contact" component={Contact} />

                {/* Auth Pages */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/update-password" component={UpdatePassword} />
        <Route component={NotFound} /> {/* This must be last */}

      {/* Protected Dashboard Pages */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardHome />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/accounts">
        <ProtectedRoute>
          <Accounts />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/transactions">
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/send">
        <ProtectedRoute>
          <SendFunds />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/deposit">
        <ProtectedRoute>
          <Deposit />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/security">
        <ProtectedRoute>
          <DashboardSecurity />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/settings">
        <ProtectedRoute>
          <DashboardSettings />
        </ProtectedRoute>
      </Route>
        <Route path="/admin/deposits">
            <AdminRoute>
                <DepositApproval />
            </AdminRoute>
        </Route>
        <Route path="/admin/users">
            <AdminRoute>
                <UserManagement />
            </AdminRoute>
        </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
