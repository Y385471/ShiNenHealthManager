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
  CardFooter,
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
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Plus, Search } from "lucide-react";
import InventoryForm from "@/components/inventory/InventoryForm";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type InventoryItem } from "@shared/schema";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  const { data: lowStockItems, isLoading: isLowStockLoading } = useQuery({
    queryKey: ["/api/inventory/low-stock"],
  });

  const filteredItems = inventoryItems ? 
    inventoryItems.filter((item: InventoryItem) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const calculateStockPercentage = (item: InventoryItem) => {
    return Math.min(100, Math.round((item.quantity / item.minQuantity) * 100));
  };

  const getStockStatusClasses = (item: InventoryItem) => {
    const percentage = calculateStockPercentage(item);
    if (percentage <= 30) return "text-status-danger";
    if (percentage <= 60) return "text-status-warning";
    return "text-status-success";
  };

  const getProgressBarColor = (item: InventoryItem) => {
    const percentage = calculateStockPercentage(item);
    if (percentage <= 30) return "bg-status-danger";
    if (percentage <= 60) return "bg-status-warning";
    return "bg-status-success";
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">المخزون والخامات</h1>
        <p className="text-neutral-500">إدارة المواد المستهلكة والمخزون في العيادة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>قائمة المخزون</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع المواد المستهلكة في العيادة
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="ml-2 h-4 w-4" /> إضافة مادة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>إضافة مادة جديدة</DialogTitle>
                  </DialogHeader>
                  <InventoryForm onSuccess={() => {
                    setIsDialogOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
                    queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
                    toast({
                      title: "تم إضافة المادة بنجاح",
                    });
                  }} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المخزون..."
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
                        <TableHead className="w-[200px]">المادة</TableHead>
                        <TableHead>الكمية</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>حالة المخزون</TableHead>
                        <TableHead className="text-left">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            لا توجد بيانات متطابقة مع البحث
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item: InventoryItem) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.name}
                              {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                            </TableCell>
                            <TableCell>{item.quantity} {item.unit}</TableCell>
                            <TableCell>{item.category || "-"}</TableCell>
                            <TableCell>{item.price || "-"}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between">
                                  <span className="text-xs">{item.quantity} من أصل {item.minQuantity}</span>
                                  <span className={`text-xs font-medium ${getStockStatusClasses(item)}`}>
                                    {calculateStockPercentage(item)}%
                                  </span>
                                </div>
                                <Progress 
                                  value={calculateStockPercentage(item)} 
                                  className="h-2"
                                  indicatorClassName={getProgressBarColor(item)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">تعديل</Button>
                                <Button variant="outline" size="sm">تعديل الكمية</Button>
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

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="ml-2 h-5 w-5 text-status-warning" /> 
                المخزون المنخفض
              </CardTitle>
              <CardDescription>
                المواد التي تحتاج إلى إعادة طلب
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLowStockLoading ? (
                <div className="text-center py-8">جاري التحميل...</div>
              ) : lowStockItems && lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  جميع المواد متوفرة بكميات كافية
                </div>
              ) : (
                <div className="space-y-4">
                  {lowStockItems && lowStockItems.map((item: InventoryItem) => (
                    <div key={item.id} className="p-3 border rounded-lg hover:bg-neutral-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{item.name}</div>
                        <span className="text-xs px-2 py-1 rounded-full bg-status-danger bg-opacity-10 text-status-danger">
                          منخفض
                        </span>
                      </div>
                      <div className="text-sm text-neutral-600 mb-2">
                        المتبقي: {item.quantity} {item.unit} من أصل {item.minQuantity}
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-status-danger h-2 rounded-full" 
                          style={{ width: `${calculateStockPercentage(item)}%` }}
                        ></div>
                      </div>
                      <Button variant="link" className="text-primary p-0 h-auto">
                        طلب إعادة توريد
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 bg-neutral-50 flex justify-center">
              <Button variant="link" className="text-primary h-auto">
                إدارة طلبات التوريد
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
