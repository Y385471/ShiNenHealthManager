import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit, Phone } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";

export default function TodayAppointments() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments/today"],
  });

  const filteredAppointments = statusFilter
    ? appointments?.filter((appt: any) => appt.status === statusFilter)
    : appointments;

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          text: "مؤكد",
          className: "bg-status-success bg-opacity-10 text-status-success",
        };
      case "pending":
        return {
          text: "في الانتظار",
          className: "bg-status-warning bg-opacity-10 text-status-warning",
        };
      case "cancelled":
        return {
          text: "ملغي",
          className: "bg-status-danger bg-opacity-10 text-status-danger",
        };
      default:
        return {
          text: status,
          className: "bg-neutral-100 text-neutral-600",
        };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-semibold text-lg">مواعيد اليوم</h2>
        <div className="flex gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
              statusFilter === null
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
            onClick={() => setStatusFilter(null)}
          >
            الجميع
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
              statusFilter === "confirmed"
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-status-success bg-opacity-10 text-status-success hover:bg-status-success hover:bg-opacity-20"
            }`}
            onClick={() => setStatusFilter("confirmed")}
          >
            مؤكد
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
              statusFilter === "pending"
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-status-warning bg-opacity-10 text-status-warning hover:bg-status-warning hover:bg-opacity-20"
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            في الانتظار
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-500">جاري تحميل المواعيد...</p>
        </div>
      ) : filteredAppointments?.length === 0 ? (
        <div className="p-8 text-center text-neutral-500">
          لا توجد مواعيد لعرضها
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">الوقت</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">المريض</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">الخدمة</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">الطبيب</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">الحالة</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredAppointments?.map((appointment: any) => (
                <tr key={appointment.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 text-sm">
                    {format(new Date(appointment.startTime), 'h:mm a', { locale: ar })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 rounded-full ml-2">
                        <AvatarFallback className="bg-primary text-white">
                          {getInitials(appointment.patient?.fullName || 'مريض')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{appointment.patient?.fullName || `مريض #${appointment.patientId}`}</div>
                        <div className="text-xs text-neutral-500">{appointment.patient?.phoneNumber || 'لا يوجد رقم'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{appointment.service?.name || '-'}</td>
                  <td className="py-3 px-4 text-sm">{appointment.doctor?.fullName || `طبيب #${appointment.doctorId}`}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 ${getStatusDisplay(appointment.status).className} text-xs rounded-full`}>
                      {getStatusDisplay(appointment.status).text}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4 text-accent" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-center">
        <Link href="/appointments" className="text-primary text-sm hover:underline">
          عرض كل المواعيد
        </Link>
      </div>
    </div>
  );
}
