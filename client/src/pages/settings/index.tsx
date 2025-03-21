import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  UserPlus,
  Shield,
  Bell,
  Smartphone,
  FileText,
  Settings as SettingsIcon,
  Save,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Profile settings form schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "الاسم يجب أن يكون أكثر من حرفين" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  phoneNumber: z.string().min(8, { message: "رقم الهاتف يجب أن يكون صحيحاً" }),
});

// Security settings form schema
const securityFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "كلمة المرور الحالية مطلوبة" }),
  newPassword: z.string().min(6, { message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

// Notification settings form schema
const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  appointmentReminders: z.boolean(),
  marketingEmails: z.boolean(),
});

// WhatsApp settings form schema
const whatsappFormSchema = z.object({
  apiKey: z.string().min(1, { message: "مفتاح API مطلوب" }),
  fromPhoneNumber: z.string().min(8, { message: "رقم الهاتف يجب أن يكون صحيحاً" }),
  appointmentTemplateId: z.string(),
  followupTemplateId: z.string(),
  paymentTemplateId: z.string(),
});

// User form schema
const userFormSchema = z.object({
  username: z.string().min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" }),
  fullName: z.string().min(2, { message: "الاسم يجب أن يكون أكثر من حرفين" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  role: z.enum(["manager", "doctor", "secretary", "nurse"]),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }).optional(),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type WhatsAppFormValues = z.infer<typeof whatsappFormSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: "",
      phoneNumber: "",
    },
  });

  // Security form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      marketingEmails: false,
    },
  });

  // WhatsApp form
  const whatsappForm = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: {
      apiKey: "",
      fromPhoneNumber: "",
      appointmentTemplateId: "",
      followupTemplateId: "",
      paymentTemplateId: "",
    },
  });

  // New user form
  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      password: "",
      role: "doctor",
      email: "",
      phoneNumber: "",
    },
  });

  // Load users for the users tab
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["/api/users"],
    enabled: user?.role === "manager" && activeTab === "users",
  });

  async function onProfileSubmit(data: ProfileFormValues) {
    try {
      // In a real app, you would update the user profile here
      // await apiRequest("PATCH", `/api/users/${user?.id}`, data);
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم تحديث بيانات الملف الشخصي بنجاح",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }

  async function onSecuritySubmit(data: SecurityFormValues) {
    try {
      // In a real app, you would update the password here
      // await apiRequest("POST", "/api/auth/change-password", data);
      
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح",
      });
      securityForm.reset();
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تغيير كلمة المرور. يرجى التأكد من صحة كلمة المرور الحالية.",
        variant: "destructive",
      });
    }
  }

  async function onNotificationSubmit(data: NotificationFormValues) {
    try {
      // In a real app, you would update notification settings here
      // await apiRequest("POST", "/api/settings/notifications", data);
      
      toast({
        title: "تم تحديث إعدادات الإشعارات",
        description: "تم تحديث إعدادات الإشعارات بنجاح",
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث إعدادات الإشعارات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }

  async function onWhatsAppSubmit(data: WhatsAppFormValues) {
    try {
      // In a real app, you would update WhatsApp settings here
      // await apiRequest("POST", "/api/settings/whatsapp", data);
      
      toast({
        title: "تم تحديث إعدادات WhatsApp",
        description: "تم تحديث إعدادات WhatsApp بنجاح",
      });
    } catch (error) {
      console.error("Error updating WhatsApp settings:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث إعدادات WhatsApp. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }

  async function onUserSubmit(data: UserFormValues) {
    try {
      await apiRequest("POST", "/api/users", data);
      
      toast({
        title: "تم إضافة المستخدم",
        description: "تم إضافة المستخدم الجديد بنجاح",
      });
      userForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة المستخدم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) return;
    
    try {
      // In a real app, you would delete the user here
      // await apiRequest("DELETE", `/api/users/${userToDelete}`);
      
      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح",
      });
      setIsDeleteUserDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من حذف المستخدم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "manager":
        return "مدير";
      case "doctor":
        return "طبيب";
      case "secretary":
        return "سكرتارية";
      case "nurse":
        return "تمريض";
      default:
        return role;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">الإعدادات</h1>
        <p className="text-neutral-500">إدارة حسابك وإعدادات النظام</p>
      </div>

      <Tabs 
        defaultValue="profile" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="profile" className="flex items-center">
            <UserPlus className="ml-2 h-4 w-4" /> الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="ml-2 h-4 w-4" /> الأمان
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="ml-2 h-4 w-4" /> الإشعارات
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center">
            <Smartphone className="ml-2 h-4 w-4" /> WhatsApp
          </TabsTrigger>
          {user?.role === "manager" && (
            <TabsTrigger value="users" className="flex items-center">
              <UserPlus className="ml-2 h-4 w-4" /> المستخدمين
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>
                تحديث معلومات الملف الشخصي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="أدخل اسمك الكامل" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="أدخل بريدك الإلكتروني" type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="أدخل رقم الهاتف" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-4">
                    <Save className="ml-2 h-4 w-4" /> حفظ التغييرات
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>الأمان</CardTitle>
              <CardDescription>
                تغيير كلمة المرور وإعدادات الأمان
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور الحالية</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="أدخل كلمة المرور الحالية" type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور الجديدة</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="أدخل كلمة المرور الجديدة" type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تأكيد كلمة المرور</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="أدخل كلمة المرور مرة أخرى" type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-4">
                    <Save className="ml-2 h-4 w-4" /> تغيير كلمة المرور
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>الإشعارات</CardTitle>
              <CardDescription>
                إدارة تفضيلات الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">إشعارات البريد الإلكتروني</FormLabel>
                            <FormDescription>
                              تلقي إشعارات عبر البريد الإلكتروني
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="smsNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">إشعارات الرسائل النصية</FormLabel>
                            <FormDescription>
                              تلقي إشعارات عبر الرسائل النصية
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="appointmentReminders"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">تذكيرات المواعيد</FormLabel>
                            <FormDescription>
                              تلقي تذكيرات بالمواعيد القادمة
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">رسائل تسويقية</FormLabel>
                            <FormDescription>
                              تلقي عروض وأخبار عن العيادة
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">
                    <Save className="ml-2 h-4 w-4" /> حفظ الإعدادات
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات WhatsApp</CardTitle>
              <CardDescription>
                إعداد تكامل WhatsApp للتواصل مع المرضى
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...whatsappForm}>
                <form onSubmit={whatsappForm.handleSubmit(onWhatsAppSubmit)} className="space-y-4">
                  <FormField
                    control={whatsappForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مفتاح API</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="أدخل مفتاح API الخاص بـ WhatsApp" />
                        </FormControl>
                        <FormDescription>
                          يمكنك الحصول على مفتاح API من لوحة تحكم WhatsApp Business
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={whatsappForm.control}
                    name="fromPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف المرسل</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="أدخل رقم الهاتف المستخدم للإرسال" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={whatsappForm.control}
                      name="appointmentTemplateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رسالة تذكير بالموعد</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="معرف القالب" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={whatsappForm.control}
                      name="followupTemplateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رسالة متابعة العلاج</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="معرف القالب" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={whatsappForm.control}
                      name="paymentTemplateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رسالة تذكير بالدفع</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="معرف القالب" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="mt-4">
                    <Save className="ml-2 h-4 w-4" /> حفظ إعدادات WhatsApp
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === "manager" && (
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>إضافة مستخدم جديد</CardTitle>
                  <CardDescription>
                    إضافة حسابات جديدة للموظفين
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                      <FormField
                        control={userForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المستخدم</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="أدخل اسم المستخدم" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الكامل</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="أدخل الاسم الكامل" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="أدخل كلمة المرور" type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الدور</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر الدور" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="manager">مدير</SelectItem>
                                <SelectItem value="doctor">طبيب</SelectItem>
                                <SelectItem value="secretary">سكرتارية</SelectItem>
                                <SelectItem value="nurse">تمريض</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={userForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>البريد الإلكتروني (اختياري)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="أدخل البريد الإلكتروني" type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={userForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>رقم الهاتف (اختياري)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="أدخل رقم الهاتف" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="mt-4">
                        <UserPlus className="ml-2 h-4 w-4" /> إضافة مستخدم
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>المستخدمون الحاليون</CardTitle>
                  <CardDescription>
                    إدارة المستخدمين الحاليين في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isUsersLoading ? (
                    <div className="text-center py-8">جاري تحميل البيانات...</div>
                  ) : users?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      لا يوجد مستخدمين لعرضهم
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users?.map((user: any) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>{user.username}</span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                              <span>{getRoleName(user.role)}</span>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setUserToDelete(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد من حذف هذا المستخدم؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                  سيتم حذف حساب المستخدم "{user.fullName}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeleteUser}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  <Trash2 className="ml-2 h-4 w-4" /> حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <AlertTriangle className="ml-2 h-5 w-5" /> منطقة الخطر
                </CardTitle>
                <CardDescription>
                  إجراءات متقدمة يمكن أن تؤثر على كامل النظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-destructive/50 rounded-lg p-4">
                    <h3 className="font-medium text-destructive mb-2">استعادة النسخة الاحتياطية</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      استعادة النظام من نسخة احتياطية سابقة. سيؤدي هذا إلى استبدال جميع البيانات الحالية.
                    </p>
                    <div className="flex items-center gap-4">
                      <Input type="file" className="flex-1" />
                      <Button variant="destructive">استعادة النسخة الاحتياطية</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="border border-destructive/50 rounded-lg p-4">
                    <h3 className="font-medium text-destructive mb-2">حذف جميع البيانات</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      سيؤدي هذا إلى حذف جميع بيانات النظام بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
                    </p>
                    <Button variant="destructive">حذف جميع البيانات</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
