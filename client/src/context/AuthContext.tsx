import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login as loginApi, logout as logoutApi, getCurrentUser } from "@/lib/auth";
import { LoginData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type User = {
  id: number;
  username: string;
  fullName: string;
  role: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        // User is not logged in, which is fine
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const userData = await loginApi(data);
      setUser(userData);
      setLocation("/");
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا ${userData.fullName}`,
      });
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "تأكد من اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      setLocation("/login");
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الخروج",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
