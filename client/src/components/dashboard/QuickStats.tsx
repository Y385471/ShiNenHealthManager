import { LayoutDashboard, UserPlus, AlertTriangle, DollarSign } from "lucide-react";

interface QuickStatsProps {
  isLoading: boolean;
  dashboardData?: {
    appointmentsToday: number;
    newPatientsThisMonth: number;
    lowStockItems: number;
    monthlyRevenue: number;
  };
}

export default function QuickStats({ isLoading, dashboardData }: QuickStatsProps) {
  const stats = [
    {
      title: "المواعيد اليوم",
      value: dashboardData?.appointmentsToday || 0,
      icon: <LayoutDashboard />,
      color: "bg-blue-100 text-primary",
    },
    {
      title: "مرضى جدد (الشهر)",
      value: dashboardData?.newPatientsThisMonth || 0,
      suffix: "مريض",
      icon: <UserPlus />,
      color: "bg-green-100 text-status-success",
    },
    {
      title: "مواد منخفضة المخزون",
      value: dashboardData?.lowStockItems || 0,
      suffix: "منتجات",
      icon: <AlertTriangle />,
      color: "bg-orange-100 text-accent",
    },
    {
      title: "الإيرادات (الشهر)",
      value: dashboardData?.monthlyRevenue || 0,
      prefix: "ج.م",
      icon: <DollarSign />,
      color: "bg-purple-100 text-status-pending",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className={`${stat.color} p-3 rounded-full ml-3`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-neutral-500 text-sm">{stat.title}</p>
            <p className="text-xl font-semibold text-neutral-800">
              {stat.prefix && `${stat.prefix} `}
              {typeof stat.value === "number" && 
                new Intl.NumberFormat('ar-EG').format(stat.value)}
              {stat.suffix && ` ${stat.suffix}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
