import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";

export default function InventoryAlerts() {
  const { data: lowStockItems, isLoading } = useQuery({
    queryKey: ["/api/inventory/low-stock"],
  });

  const calculateStockPercentage = (item: any) => {
    return Math.min(100, Math.round((item.quantity / item.minQuantity) * 100));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-4 border-b border-neutral-200">
        <h2 className="font-semibold text-lg">تنبيهات المخزون</h2>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-500">جاري تحميل البيانات...</p>
        </div>
      ) : lowStockItems?.length === 0 ? (
        <div className="p-8 text-center text-neutral-500">
          لا توجد مواد منخفضة المخزون
        </div>
      ) : (
        <div className="divide-y divide-neutral-200">
          {lowStockItems?.map((item: any) => (
            <div key={item.id} className="p-4 hover:bg-neutral-50">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{item.name}</div>
                <span className="text-xs px-2 py-1 rounded-full bg-status-danger bg-opacity-10 text-status-danger">
                  {calculateStockPercentage(item) <= 30 ? "منخفض" : "تحذير"}
                </span>
              </div>
              <div className="text-sm text-neutral-600 mb-2">
                المتبقي: {item.quantity} {item.unit} من أصل {item.minQuantity}
              </div>
              <Progress 
                value={calculateStockPercentage(item)} 
                className="h-2 mb-2"
                indicatorClassName={
                  calculateStockPercentage(item) <= 30 
                    ? "bg-status-danger" 
                    : "bg-status-warning"
                }
              />
              <Button variant="link" className="p-0 h-auto text-primary text-sm">
                طلب إعادة توريد
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-center">
        <Link href="/inventory" className="text-primary text-sm hover:underline">
          إدارة المخزون
        </Link>
      </div>
    </div>
  );
}
