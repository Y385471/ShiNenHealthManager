import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import QuickStats from "@/components/dashboard/QuickStats";
import TodayAppointments from "@/components/dashboard/TodayAppointments";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import WhatsAppMessages from "@/components/dashboard/WhatsAppMessages";
import RecentPatients from "@/components/dashboard/RecentPatients";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">لوحة التحكم</h1>
        <p className="text-neutral-500">
          مرحباً بك مجدداً، {user?.fullName}. آخر تسجيل دخول: {format(new Date(), "P aaaa", { locale: ar })}
        </p>
      </div>

      <QuickStats isLoading={isDashboardLoading} dashboardData={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <TodayAppointments />
        </div>
        <div className="lg:col-span-1">
          <InventoryAlerts />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <PerformanceMetrics />
        </div>
        <div className="lg:col-span-1">
          <WhatsAppMessages />
        </div>
      </div>

      <div className="mt-6">
        <RecentPatients />
      </div>
    </div>
  );
}
