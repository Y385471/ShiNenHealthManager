import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MessageSquare, Send, Eye } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";

const messageFormSchema = z.object({
  patientId: z.number(),
  messageType: z.string(),
  message: z.string().min(1, { message: "محتوى الرسالة مطلوب" }),
  appointmentId: z.number().optional(),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

export default function WhatsApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/whatsapp/messages"],
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  const { data: appointments } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const filteredMessages = messages
    ? messages.filter((message: any) => {
        const patientName = message.patient?.fullName || "";
        return (
          message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.messageType.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : [];

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      messageType: "appointment_reminder",
      message: "",
    },
  });

  const watchPatientId = form.watch("patientId");

  // Filter appointments for the selected patient
  const patientAppointments = appointments
    ? appointments.filter((appt: any) => appt.patientId === Number(watchPatientId))
    : [];

  async function onSubmit(data: MessageFormValues) {
    try {
      await apiRequest("POST", "/api/whatsapp/send", data);
      toast({
        title: "تم إرسال الرسالة بنجاح",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/messages"] });
      form.reset();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    }
  }

  const getMessageTypeDisplay = (type: string) => {
    switch (type) {
      case "appointment_reminder":
        return "تذكير بالموعد";
      case "followup":
        return "متابعة العلاج";
      case "payment_reminder":
        return "تذكير بالدفع";
      default:
        return type;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "sent":
        return {
          text: "تم الإرسال",
          className: "bg-status-success bg-opacity-10 text-status-success",
        };
      case "delivered":
        return {
          text: "تم التسليم",
          className: "bg-status-info bg-opacity-10 text-status-info",
        };
      case "read":
        return {
          text: "تمت القراءة",
          className: "bg-primary bg-opacity-10 text-primary",
        };
      case "failed":
        return {
          text: "فشل الإرسال",
          className: "bg-status-danger bg-opacity-10 text-status-danger",
        };
      default:
        return {
          text: status,
          className: "bg-neutral-100 text-neutral-600",
        };
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">رسائل WhatsApp</h1>
        <p className="text-neutral-500">إدارة التواصل مع المرضى من خلال WhatsApp</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>سجل الرسائل</CardTitle>
            <CardDescription>
              جميع الرسائل المرسلة للمرضى
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="ml-2 h-4 w-4" /> رسالة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>إرسال رسالة WhatsApp جديدة</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المريض</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المريض" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {patients?.map((patient: any) => (
                              <SelectItem key={patient.id} value={patient.id.toString()}>
                                {patient.fullName} - {patient.phoneNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="messageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الرسالة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع الرسالة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="appointment_reminder">تذكير بالموعد</SelectItem>
                            <SelectItem value="followup">متابعة العلاج</SelectItem>
                            <SelectItem value="payment_reminder">تذكير بالدفع</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchPatientId && patientAppointments.length > 0 && (
                    <FormField
                      control={form.control}
                      name="appointmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الموعد (اختياري)</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر موعداً مرتبطاً (اختياري)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {patientAppointments.map((appt: any) => (
                                <SelectItem key={appt.id} value={appt.id.toString()}>
                                  {format(new Date(appt.startTime), "PPP p", { locale: ar })}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>محتوى الرسالة</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل محتوى الرسالة هنا..."
                            className="resize-none min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit">
                      <Send className="ml-2 h-4 w-4" /> إرسال
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative w-full md:w-72">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الرسائل..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">جاري تحميل البيانات...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>المريض</TableHead>
                    <TableHead>نوع الرسالة</TableHead>
                    <TableHead>محتوى الرسالة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        لا توجد بيانات متطابقة مع البحث
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((message: any) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          {format(new Date(message.sentAt), "PPP p", { locale: ar })}
                        </TableCell>
                        <TableCell>
                          {message.patient
                            ? message.patient.fullName
                            : `مريض #${message.patientId}`}
                        </TableCell>
                        <TableCell>
                          {getMessageTypeDisplay(message.messageType)}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate">{message.message}</div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              getStatusDisplay(message.status).className
                            }`}
                          >
                            {getStatusDisplay(message.status).text}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
