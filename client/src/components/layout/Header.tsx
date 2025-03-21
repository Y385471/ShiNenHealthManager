import { Bell, Menu, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getAvatarFallbackColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-primary text-white';
      case 'doctor':
        return 'bg-secondary text-white';
      case 'secretary':
        return 'bg-accent text-white';
      case 'nurse':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'manager':
        return 'مدير';
      case 'doctor':
        return 'طبيب أسنان';
      case 'secretary':
        return 'سكرتارية';
      case 'nurse':
        return 'تمريض';
      default:
        return role;
    }
  };

  return (
    <header className="bg-white shadow-sm z-10 fixed top-0 left-0 right-0">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            <Menu />
          </button>
          <div className="flex items-center">
            <span className="text-primary font-bold text-xl">Shinenwhite</span>
            <span className="text-neutral-500 text-lg mr-1">Clinic Manager</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 relative">
              <Bell />
              <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </button>
          </div>
          
          {user && (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-neutral-100 p-1 rounded-md">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getAvatarFallbackColor(user.role)}>
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-right">
                    <div className="font-medium text-sm">{user.fullName}</div>
                    <div className="text-xs text-neutral-500">{getRoleText(user.role)}</div>
                  </div>
                  <ChevronDown className="text-neutral-400 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent ref={dropdownRef} className="w-56" align="end">
                <DropdownMenuItem className="text-right" onClick={() => logout()}>
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
