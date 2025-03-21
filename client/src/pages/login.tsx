import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginData) {
    setIsLoggingIn(true);
    try {
      await login(data);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  }

  // Quick login helpers for demo purposes
  const quickLogin = (role: string) => {
    let username = "";
    let password = "";

    switch (role) {
      case "manager":
        username = "admin";
        password = "admin123";
        break;
      case "doctor":
        username = "doctor1";
        password = "doctor123";
        break;
      case "secretary":
        username = "secretary";
        password = "secretary123";
        break;
      case "nurse":
        username = "nurse";
        password = "nurse123";
        break;
    }

    form.setValue("username", username);
    form.setValue("password", password);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="fixed inset-0 bg-primary-dark flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-primary text-4xl font-bold mb-2">Shinenwhite</div>
          <div className="text-neutral-600 text-xl">Clinic Manager</div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المستخدم</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ادخل اسم المستخدم" 
                      {...field} 
                      className="w-full px-4 py-2" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="ادخل كلمة المرور" 
                      {...field} 
                      className="w-full px-4 py-2" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-neutral-600 text-sm">تذكرني</label>
              </div>
              <a href="#" className="text-primary text-sm hover:underline">نسيت كلمة المرور؟</a>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center text-neutral-500 text-sm">
          تسجيل الدخول كـ:
          <div className="flex justify-center gap-2 mt-2">
            <button 
              onClick={() => quickLogin("manager")}
              className="px-3 py-1 bg-neutral-200 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors"
            >
              مدير
            </button>
            <button
              onClick={() => quickLogin("doctor")} 
              className="px-3 py-1 bg-neutral-200 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors"
            >
              طبيب
            </button>
            <button 
              onClick={() => quickLogin("secretary")}
              className="px-3 py-1 bg-neutral-200 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors"
            >
              سكرتارية
            </button>
            <button 
              onClick={() => quickLogin("nurse")}
              className="px-3 py-1 bg-neutral-200 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors"
            >
              تمريض
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
