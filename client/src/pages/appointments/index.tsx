import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Plus, Search } from "lucide-react";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { appointmentStatusEnum } from "@shared/schema";

const appointmentStatusColors: Record<string, string> = {
  confirmed: "bg-status-success bg-opacity-10 text-status-success",
  pending: "bg-status-warning bg-opacity-10 text-status-warning",
  cancelled: "bg-status-danger bg-opacity-10 text-status-danger",
};

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const filteredAppointments = appointments ? 
    appointments.filter((appointment: any) => {
      const appointmentDate = new Date(appointment.startTime);
      return (
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear()
      );
    }) : [];

  // Group appointments by status
  const confirmedAppointments = filteredAppointments.filter((appt: any) => appt.status === "confirmed");
  const pendingAppointments = filteredAppointments.filter((appt: any) => appt.status === "pending");
  const cancelledAppointments = filteredAppointments.filter((appt: any) => appt.status === "cancelled");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">المواعيد</h1>
        <p className="text-neutral-500">إدارة مواعيد العيادة وجدولة المرضى</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>التقويم</CardTitle>
              <CardDescription>
                اختر يوماً لعرض المواعيد
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                locale={ar}
              />
              
              <div className="mt-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="ml-2 h-4 w-4" /> إضافة موعد جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>إضافة موعد جديد</DialogTitle>
                    </DialogHeader>
                    <AppointmentForm 
                      initialDate={selectedDate} 
                      onSuccess={() => {
                        setIsDialogOpen(false);
                        queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
                        toast({
                          title: "تم إضافة الموعد بنجاح",
                        });
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-6 space-y-2">
                <div className="text-sm font-medium">حالات المواعيد:</div>
                <div className="flex items-center text-xs">
                  <span className="h-3 w-3 rounded-full bg-status-success mr-2"></span>
                  <span>مؤكد</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="h-3 w-3 rounded-full bg-status-warning mr-2"></span>
                  <span>في الانتظار</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="h-3 w-3 rounded-full bg-status-danger mr-2"></span>
                  <span>ملغي</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                مواعيد {format(selectedDate, "PPP", { locale: ar })}
              </CardTitle>
              <CardDescription>
                {filteredAppointments.length} موعد
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">جاري تحميل البيانات...</div>
              ) : (
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">الكل ({filteredAppointments.length})</TabsTrigger>
                    <TabsTrigger value="confirmed">مؤكد ({confirmedAppointments.length})</TabsTrigger>
                    <TabsTrigger value="pending">في الانتظار ({pendingAppointments.length})</TabsTrigger>
                    <TabsTrigger value="cancelled">ملغي ({cancelledAppointments.length})</TabsTrigger>
                  </TabsList>

                  {["all", "confirmed", "pending", "cancelled"].map((tabValue) => {
                    let appointmentsToDisplay;
                    
                    switch (tabValue) {
                      case "confirmed":
                        appointmentsToDisplay = confirmedAppointments;
                        break;
                      case "pending":
                        appointmentsToDisplay = pendingAppointments;
                        break;
                      case "cancelled":
                        appointmentsToDisplay = cancelledAppointments;
                        break;
                      default:
                        appointmentsToDisplay = filteredAppointments;
                    }
                    
                    return (
                      <TabsContent key={tabValue} value={tabValue}>
                        {appointmentsToDisplay.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            لا توجد مواعيد متطابقة
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {appointmentsToDisplay.map((appointment: any) => (
                              <Card key={appointment.id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">
                                        {format(new Date(appointment.startTime), "hh:mm a", { locale: ar })}
                                        {" - "}
                                        {format(new Date(appointment.endTime), "hh:mm a", { locale: ar })}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Patient ID: {appointment.patientId}, Doctor ID: {appointment.doctorId}
                                      </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs ${appointmentStatusColors[appointment.status]}`}>
                                      {appointment.status === "confirmed" ? "مؤكد" : 
                                       appointment.status === "pending" ? "في الانتظار" : 
                                       "ملغي"}
                                    </div>
                                  </div>
                                  {appointment.notes && (
                                    <div className="mt-2 text-sm">
                                      <span className="font-medium">ملاحظات:</span> {appointment.notes}
                                    </div>
                                  )}
                                  <div className="mt-3 flex gap-2 justify-end">
                                    <Button variant="outline" size="sm">تعديل</Button>
                                    <Button variant="outline" size="sm" className="text-accent">WhatsApp</Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
