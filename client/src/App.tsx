import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients/index";
import Appointments from "@/pages/appointments/index";
import Inventory from "@/pages/inventory/index";
import Finance from "@/pages/finance/index";
import WhatsApp from "@/pages/whatsapp/index";
import Reports from "@/pages/reports/index";
import Settings from "@/pages/settings/index";
import Layout from "@/components/layout/Layout";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">
      <div className="text-primary text-2xl">جاري التحميل...</div>
    </div>;
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return <>{children}</>;
}

function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  
  // We need to know if we're on the login page to avoid showing Layout
  const isLoginPage = location === "/login";
  
  // If not authenticated and not on login page, redirect will happen in AuthenticatedRoute
  
  if (isLoginPage) {
    return <Login />;
  }
  
  return (
    <Layout>
      <AuthenticatedRoute>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/patients" component={Patients} />
          <Route path="/appointments" component={Appointments} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/finance" component={Finance} />
          <Route path="/whatsapp" component={WhatsApp} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </AuthenticatedRoute>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
