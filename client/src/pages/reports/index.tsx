import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, TrendingUp, Users, Calendar, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ["#0277bd", "#00897b", "#ff5722", "#805ad5"];

export default function Reports() {
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

  const { data: inventoryConsumption, isLoading: isInventoryLoading } = useQuery({
    queryKey: ["/api/analytics/inventory-consumption"],
  });

  const isLoading =
    isPatientGrowthLoading ||
    isAppointmentStatsLoading ||
    isRevenueLoading ||
    isInventoryLoading;

  // Format appointment stats for the pie chart
  const appointmentChartData = appointmentStats?.map((stat: any) => ({
    name: stat.status === "confirmed" ? "مؤكد" : stat.status === "pending" ? "في الانتظار" : "ملغي",
    value: stat.count,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">التقارير ومؤشرات الأداء</h1>
        <p className="text-neutral-500">تحليل بيانات وأداء العيادة</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={timeFrame} onValueChange={(value: any) => setTimeFrame(value)}>
          <TabsList>
            <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
            <TabsTrigger value="monthly">شهري</TabsTrigger>
            <TabsTrigger value="yearly">سنوي</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline">
          <Download className="ml-2 h-4 w-4" /> تصدير التقارير
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-neutral-500">المرضى الجدد</div>
                <div className="text-2xl font-bold">
                  {patientGrowthData
                    ? patientGrowthData[patientGrowthData.length - 1]?.count || 0
                    : 0}
                </div>
              </div>
              <div className="bg-green-100 text-status-success p-3 rounded-full">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="text-xs text-status-success flex items-center">
              <TrendingUp className="h-3 w-3 ml-1" />
              نمو 12% مقارنة بالشهر السابق
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-neutral-500">المواعيد</div>
                <div className="text-2xl font-bold">
                  {appointmentStats
                    ? appointmentStats.reduce((sum: number, stat: any) => sum + stat.count, 0)
                    : 0}
                </div>
              </div>
              <div className="bg-blue-100 text-primary p-3 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="text-xs text-status-success flex items-center">
              <TrendingUp className="h-3 w-3 ml-1" />
              زيادة 8% في المواعيد المؤكدة
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-neutral-500">استهلاك المخزون</div>
                <div className="text-2xl font-bold">
                  {inventoryConsumption
                    ? inventoryConsumption.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0
                      )
                    : 0}{" "}
                  وحدة
                </div>
              </div>
              <div className="bg-orange-100 text-accent p-3 rounded-full">
                <Package2 className="h-6 w-6" />
              </div>
            </div>
            <div className="text-xs text-status-warning flex items-center">
              <TrendingUp className="h-3 w-3 ml-1" />
              زيادة 5% في معدل الاستهلاك
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-neutral-500">صافي الإيرادات</div>
                <div className="text-2xl font-bold">
                  {monthlyRevenue
                    ? new Intl.NumberFormat("ar-EG").format(
                        monthlyRevenue.reduce((sum: number, month: any) => sum + month.revenue, 0)
                      )
                    : 0}{" "}
                  ج.م
                </div>
              </div>
              <div className="bg-purple-100 text-status-pending p-3 rounded-full">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="text-xs text-status-success flex items-center">
              <TrendingUp className="h-3 w-3 ml-1" />
              زيادة 15% مقارنة بالشهر السابق
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>الإيرادات الشهرية</CardTitle>
            <CardDescription>تطور الإيرادات على مدار الأشهر</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyRevenue}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => new Intl.NumberFormat("ar-EG").format(value as number)}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="الإيرادات" fill="#0277bd" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>حالة المواعيد</CardTitle>
            <CardDescription>توزيع المواعيد حسب الحالة</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-60 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentChartData?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>نمو المرضى</CardTitle>
            <CardDescription>عدد المرضى الجدد شهرياً</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientGrowthData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="المرضى الجدد" fill="#00897b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>استهلاك المخزون</CardTitle>
            <CardDescription>المواد الأكثر استهلاكاً</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={inventoryConsumption}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 50,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="item" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" name="الكمية المستهلكة" fill="#ff5722" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
