import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Search, User, Calendar, Phone } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function RecentPatients() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: patients, isLoading } = useQuery({
    queryKey: ["/api/patients"],
  });

  // Get the 5 most recent patients
  const recentPatients = patients
    ? [...patients]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    : [];

  // Filter patients by search query
  const filteredPatients = recentPatients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phoneNumber.includes(searchQuery)
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get treatment plans for each patient
  const { data: treatmentPlans } = useQuery({
    queryKey: ["/api/treatment-plans"],
    enabled: !isLoading && recentPatients.length > 0,
  });

  const getPatientTreatmentPlan = (patientId: number) => {
    if (!treatmentPlans) return null;
    return treatmentPlans.find((plan: any) => plan.patientId === patientId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-semibold text-lg">المرضى الأخيرون</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="البحث عن مريض..."
            className="pr-8 py-1 px-3 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-500">جاري تحميل بيانات المرضى...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="p-8 text-center text-neutral-500">
          لا توجد بيانات للمرضى متطابقة مع البحث
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">
                  المريض
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">
                  رقم الهاتف
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">
                  آخر زيارة
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">
                  الطبيب المعالج
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">
                  حالة الخطة العلاجية
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredPatients.map((patient) => {
                const treatmentPlan = getPatientTreatmentPlan(patient.id);
                return (
                  <tr key={patient.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 rounded-full ml-2">
                          <AvatarFallback className="bg-primary text-white">
                            {getInitials(patient.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{patient.fullName}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{patient.phoneNumber}</td>
                    <td className="py-3 px-4 text-sm">
                      {format(
                        new Date(patient.createdAt),
                        "dd/MM/yyyy",
                        { locale: ar }
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {treatmentPlan ? `د. ${treatmentPlan.doctorId}` : "-"}
                    </td>
                    <td className="py-3 px-4">
                      {treatmentPlan ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-neutral-200 rounded-full h-2 ml-2">
                            <div
                              className="bg-status-success h-2 rounded-full"
                              style={{ width: `${treatmentPlan.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-neutral-600">
                            {treatmentPlan.progress}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-500">
                          لا توجد خطة
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/patients/${patient.id}`}>
                            <User className="h-4 w-4 text-primary" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/appointments/new?patientId=${patient.id}`}>
                            <Calendar className="h-4 w-4 text-primary" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4 text-accent" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-center">
        <Link href="/patients" className="text-primary text-sm hover:underline">
          عرض كل المرضى
        </Link>
      </div>
    </div>
  );
}
