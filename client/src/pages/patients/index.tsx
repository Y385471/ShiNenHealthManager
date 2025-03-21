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
import { Search, Plus, User, Calendar, Phone } from "lucide-react";
import PatientForm from "@/components/patients/PatientForm";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { type Patient } from "@shared/schema";

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: patients, isLoading } = useQuery({
    queryKey: ["/api/patients"],
  });

  const filteredPatients = patients ? 
    patients.filter((patient: Patient) => 
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phoneNumber.includes(searchQuery)
    ) : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">المرضى</h1>
        <p className="text-neutral-500">إدارة بيانات وملفات المرضى</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>قائمة المرضى</CardTitle>
            <CardDescription>
              عرض وإدارة جميع المرضى المسجلين في العيادة
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" /> إضافة مريض جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>إضافة مريض جديد</DialogTitle>
              </DialogHeader>
              <PatientForm onSuccess={() => {
                setIsDialogOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
                toast({
                  title: "تم إضافة المريض بنجاح",
                });
              }} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن مريض بالاسم أو رقم الهاتف..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">جاري تحميل البيانات...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">الاسم</TableHead>
                    <TableHead>رقم الهاتف</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        لا توجد بيانات متطابقة مع البحث
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient: Patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.fullName}</TableCell>
                        <TableCell>{patient.phoneNumber}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{format(new Date(patient.createdAt), "PPP", { locale: ar })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <User className="ml-1 h-4 w-4" /> عرض
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="ml-1 h-4 w-4" /> حجز موعد
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="ml-1 h-4 w-4" /> اتصال
                            </Button>
                          </div>
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
