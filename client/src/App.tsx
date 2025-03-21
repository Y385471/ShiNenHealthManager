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

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType, [key: string]: any }) {
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

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <Layout>
          <Switch>
            <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
            <Route path="/patients" component={() => <ProtectedRoute component={Patients} />} />
            <Route path="/appointments" component={() => <ProtectedRoute component={Appointments} />} />
            <Route path="/inventory" component={() => <ProtectedRoute component={Inventory} />} />
            <Route path="/finance" component={() => <ProtectedRoute component={Finance} />} />
            <Route path="/whatsapp" component={() => <ProtectedRoute component={WhatsApp} />} />
            <Route path="/reports" component={() => <ProtectedRoute component={Reports} />} />
            <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
            {/* Fallback to 404 */}
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
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
