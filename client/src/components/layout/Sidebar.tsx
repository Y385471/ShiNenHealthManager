import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Package2, 
  CreditCard, 
  Phone, 
  BarChart3, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const navLinks = [
    {
      path: "/",
      label: "لوحة التحكم",
      icon: <LayoutDashboard className="ml-3 h-5 w-5" />,
      roles: ["manager", "doctor", "secretary", "nurse"]
    },
    {
      path: "/patients",
      label: "المرضى",
      icon: <Users className="ml-3 h-5 w-5" />,
      roles: ["manager", "doctor", "secretary", "nurse"]
    },
    {
      path: "/appointments",
      label: "المواعيد",
      icon: <Calendar className="ml-3 h-5 w-5" />,
      roles: ["manager", "doctor", "secretary", "nurse"]
    },
    {
      path: "/inventory",
      label: "المخزون والخامات",
      icon: <Package2 className="ml-3 h-5 w-5" />,
      roles: ["manager", "secretary", "nurse"]
    },
    {
      path: "/finance",
      label: "النظام المالي",
      icon: <CreditCard className="ml-3 h-5 w-5" />,
      roles: ["manager", "secretary"]
    },
    {
      path: "/whatsapp",
      label: "رسائل WhatsApp",
      icon: <Phone className="ml-3 h-5 w-5" />,
      roles: ["manager", "secretary"]
    },
    {
      path: "/reports",
      label: "التقارير ومؤشرات الأداء",
      icon: <BarChart3 className="ml-3 h-5 w-5" />,
      roles: ["manager"]
    },
    {
      path: "/settings",
      label: "الإعدادات",
      icon: <Settings className="ml-3 h-5 w-5" />,
      roles: ["manager"]
    }
  ];

  const filteredNavLinks = navLinks.filter(link => 
    user && link.roles.includes(user.role)
  );

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside 
        className={`bg-white shadow-md w-64 fixed inset-y-0 right-0 transform transition-transform duration-300 z-30 overflow-y-auto lg:translate-x-0 pt-16 ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <nav className="p-4 space-y-1">
          {filteredNavLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              onClick={closeSidebarOnMobile}
            >
              <a 
                className={`flex items-center gap-3 px-4 py-3 rounded-md ${
                  location === link.path
                    ? "text-primary bg-blue-50"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            </Link>
          ))}
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-md w-full text-right"
          >
            <LogOut className="ml-3 h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
