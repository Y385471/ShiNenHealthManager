import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PerformanceMetrics() {
  const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly" | "yearly">("monthly");

  const { data: patientGrowthData, isLoading: isPatientGrowthLoading } = useQuery({
    queryKey: ["/api/analytics/patient-growth"],
  });

  const { data: appointmentStats, isLoading: isAppointmentStatsLoading } = useQuery({
    queryKey: ["/api/analytics/appointment-stats"],
  });

  const { data: monthlyRevenue, isLoading: isRevenueLoading } = useQuery({
    queryKey: ["/api/analytics/revenue"],
  });

  // Transform the monthly revenue data for the chart
  const chartData = monthlyRevenue?.map((item: any) => ({
    name: item.month,
    revenue: Number(item.revenue),
  }));

  const isLoading = isPatientGrowthLoading || isAppointmentStatsLoading || isRevenueLoading;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-semibold text-lg">مؤشرات الأداء (KPIs)</h2>
        <div className="flex gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
              timeFrame === "weekly"
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
            onClick={() => setTimeFrame("weekly")}
          >
            أسبوعي
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
              timeFrame === "monthly"
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
            onClick={() => setTimeFrame("monthly")}
          >
            شهري
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
              timeFrame === "yearly"
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
            onClick={() => setTimeFrame("yearly")}
          >
            سنوي
          </span>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('ar-EG').format(value as number)} />
                <Bar dataKey="revenue" fill="#0277bd" name="الإيرادات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {appointmentStats ? 
                `${Math.round((appointmentStats.find((s: any) => s.status === "confirmed")?.count || 0) / 
                (appointmentStats.reduce((sum: number, s: any) => sum + s.count, 0) || 1) * 100)}%` : 
                "-"}
            </div>
            <div className="text-sm text-neutral-500">نسبة المواعيد المؤكدة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">92%</div>
            <div className="text-sm text-neutral-500">رضا العملاء</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {patientGrowthData && patientGrowthData.length >= 2 ?
                `${((patientGrowthData[patientGrowthData.length - 1].count - 
                patientGrowthData[patientGrowthData.length - 2].count) / 
                (patientGrowthData[patientGrowthData.length - 2].count || 1) * 100).toFixed(0)}%` :
                "+0%"}
            </div>
            <div className="text-sm text-neutral-500">نمو عدد المرضى</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">45 دقيقة</div>
            <div className="text-sm text-neutral-500">متوسط مدة الجلسة</div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-center">
        <Link href="/reports">
          <a className="text-primary text-sm hover:underline">عرض التقرير الكامل</a>
        </Link>
      </div>
    </div>
  );
}
