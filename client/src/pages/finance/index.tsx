import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Search, Plus, Download } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

const transactionFormSchema = z.object({
  patientId: z.number().optional(),
  amount: z.string().transform((val) => Number(val)),
  type: z.enum(["income", "expense"]),
  category: z.string(),
  description: z.string().min(1, { message: "الوصف مطلوب" }),
  date: z.date(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export default function Finance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/finances"],
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  const [activeTab, setActiveTab] = useState("all");

  const filteredTransactions = transactions
    ? transactions.filter((transaction: any) => {
        // Filter by search query
        const matchesSearch =
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (transaction.category && transaction.category.toLowerCase().includes(searchQuery.toLowerCase()));

        // Filter by tab
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "income" && transaction.type === "income") ||
          (activeTab === "expense" && transaction.type === "expense");

        return matchesSearch && matchesTab;
      })
    : [];

  const incomeTotal = filteredTransactions
    .filter((t: any) => t.type === "income")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const expenseTotal = filteredTransactions
    .filter((t: any) => t.type === "expense")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const netTotal = incomeTotal - expenseTotal;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: "",
      type: "income",
      category: "",
      description: "",
      date: new Date(),
    },
  });

  async function onSubmit(data: TransactionFormValues) {
    try {
      await apiRequest("POST", "/api/finances", {
        ...data,
        date: data.date.toISOString(),
      });
      toast({
        title: "تم إضافة المعاملة المالية بنجاح",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/finances"] });
      form.reset();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة المعاملة المالية. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error("Error adding transaction:", error);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">النظام المالي</h1>
        <p className="text-neutral-500">إدارة المعاملات المالية والفواتير</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-green-50">
          <CardContent className="p-6">
            <div className="text-status-success text-sm mb-1">الإيرادات</div>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('ar-EG').format(incomeTotal)} ج.م</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent className="p-6">
            <div className="text-status-danger text-sm mb-1">المصروفات</div>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('ar-EG').format(expenseTotal)} ج.م</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <div className="text-primary text-sm mb-1">صافي الأرباح</div>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('ar-EG').format(netTotal)} ج.م</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>سجل المعاملات المالية</CardTitle>
            <CardDescription>
              عرض وإدارة جميع المعاملات المالية في العيادة
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="ml-2 h-4 w-4" /> إضافة معاملة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>إضافة معاملة مالية جديدة</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع المعاملة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع المعاملة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="income">إيرادات</SelectItem>
                              <SelectItem value="expense">مصروفات</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("type") === "income" && (
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
                                  <SelectValue placeholder="اختر المريض (اختياري)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {patients?.map((patient: any) => (
                                  <SelectItem key={patient.id} value={patient.id.toString()}>
                                    {patient.fullName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المبلغ</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="أدخل المبلغ" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الفئة</FormLabel>
                            <FormControl>
                              <Input placeholder="مثال: أجور علاج، مشتريات، مرتبات..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوصف</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل وصف المعاملة" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button type="submit">
                        حفظ المعاملة
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Download className="ml-2 h-4 w-4" /> تصدير
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المعاملات..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="income">الإيرادات</TabsTrigger>
                <TabsTrigger value="expense">المصروفات</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="text-center py-8">جاري تحميل البيانات...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>المريض</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>النوع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        لا توجد بيانات متطابقة مع البحث
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.date), "PPP", { locale: ar })}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category || "-"}</TableCell>
                        <TableCell>
                          {transaction.patientId ? `مريض #${transaction.patientId}` : "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {new Intl.NumberFormat('ar-EG').format(Number(transaction.amount))} ج.م
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              transaction.type === "income"
                                ? "bg-status-success bg-opacity-10 text-status-success"
                                : "bg-status-danger bg-opacity-10 text-status-danger"
                            }`}
                          >
                            {transaction.type === "income" ? "إيرادات" : "مصروفات"}
                          </span>
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
