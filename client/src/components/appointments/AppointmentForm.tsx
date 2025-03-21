import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema, appointmentStatusEnum } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format, addMinutes, parse, set } from "date-fns";
import { ar } from "date-fns/locale";
import { z } from "zod";

// Extend the insert schema for form validation
const appointmentFormSchema = z.object({
  patientId: z.number(),
  doctorId: z.number(),
  serviceId: z.number().optional(),
  date: z.date(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "الوقت يجب أن يكون بصيغة HH:MM",
  }),
  duration: z.number().min(15, { message: "المدة يجب أن تكون على الأقل 15 دقيقة" }),
  status: z.enum(["confirmed", "pending", "cancelled"]),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  onSuccess: () => void;
  initialDate?: Date;
}

export default function AppointmentForm({
  onSuccess,
  initialDate = new Date(),
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: patients, isLoading: isPatientsLoading } = useQuery({
    queryKey: ["/api/patients"],
  });

  const { data: doctors, isLoading: isDoctorsLoading } = useQuery({
    queryKey: ["/api/users/doctors"],
  });

  const { data: services, isLoading: isServicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const defaultValues: Partial<AppointmentFormValues> = {
    date: initialDate,
    startTime: format(new Date().setMinutes(Math.ceil(new Date().getMinutes() / 15) * 15), "HH:mm"),
    duration: 30,
    status: "pending",
    notes: "",
  };

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues,
  });

  const watchServiceId = form.watch("serviceId");

  // Update duration when service changes
  useEffect(() => {
    if (watchServiceId && services) {
      const selectedService = services.find((service: any) => service.id === Number(watchServiceId));
      if (selectedService) {
        form.setValue("duration", selectedService.duration);
      }
    }
  }, [watchServiceId, services, form]);

  async function onSubmit(data: AppointmentFormValues) {
    setIsSubmitting(true);
    try {
      // Format the datetime
      const startDate = new Date(data.date);
      const [hours, minutes] = data.startTime.split(":").map(Number);
      
      startDate.setHours(hours, minutes, 0, 0);
      const endDate = addMinutes(startDate, data.duration);

      const appointmentData = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        serviceId: data.serviceId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        status: data.status,
        notes: data.notes,
      };

      await apiRequest("POST", "/api/appointments", appointmentData);
      onSuccess();
    } catch (error) {
      console.error("Error submitting appointment form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {isPatientsLoading ? (
                      <SelectItem value="loading" disabled>
                        جاري التحميل...
                      </SelectItem>
                    ) : (
                      patients?.map((patient: any) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.fullName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الطبيب</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطبيب" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isDoctorsLoading ? (
                      <SelectItem value="loading" disabled>
                        جاري التحميل...
                      </SelectItem>
                    ) : (
                      doctors?.map((doctor: any) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.fullName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الخدمة</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isServicesLoading ? (
                    <SelectItem value="loading" disabled>
                      جاري التحميل...
                    </SelectItem>
                  ) : (
                    services?.map((service: any) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} ({service.duration} دقيقة)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>التاريخ</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-right font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ar })
                        ) : (
                          <span>اختر التاريخ</span>
                        )}
                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وقت البدء</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المدة (دقائق)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={15}
                    step={15}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الحالة</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة الموعد" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="confirmed">مؤكد</SelectItem>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أدخل أي ملاحظات خاصة بالموعد"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            إعادة تعيين
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ الموعد"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
