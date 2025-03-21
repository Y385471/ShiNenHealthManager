import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function WhatsAppMessages() {
  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/whatsapp/messages"],
  });

  // Get only the last 3 messages
  const recentMessages = messages ? messages.slice(0, 3) : [];

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `اليوم، ${format(date, "h:mm a", { locale: ar })}`;
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `أمس، ${format(date, "h:mm a", { locale: ar })}`;
    } else {
      return format(date, "dd/MM/yyyy", { locale: ar });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-4 border-b border-neutral-200">
        <h2 className="font-semibold text-lg">رسائل WhatsApp</h2>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-500">جاري تحميل الرسائل...</p>
        </div>
      ) : recentMessages.length === 0 ? (
        <div className="p-8 text-center text-neutral-500">
          لا توجد رسائل لعرضها
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 max-h-80 overflow-y-auto">
          {recentMessages.map((message: any) => (
            <div key={message.id} className="p-4 hover:bg-neutral-50">
              <div className="flex justify-between mb-2">
                <div className="font-medium text-sm">
                  {getMessageTypeDisplay(message.messageType)}
                </div>
                <span className="text-xs text-neutral-500">
                  {formatDate(message.sentAt)}
                </span>
              </div>
              <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                {message.message}
              </p>
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusDisplay(message.status).className}`}>
                  {getStatusDisplay(message.status).text}
                </span>
                <Button variant="link" className="p-0 h-auto text-primary text-sm">
                  تفاصيل
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-center">
        <Link href="/whatsapp">
          <a className="text-primary text-sm hover:underline">
            إدارة رسائل WhatsApp
          </a>
        </Link>
      </div>
    </div>
  );
}
