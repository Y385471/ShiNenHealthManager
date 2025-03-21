import { apiRequest } from "./queryClient";
import { LoginData } from "@shared/schema";

export async function login(data: LoginData) {
  const res = await apiRequest("POST", "/api/auth/login", data);
  return res.json();
}

export async function logout() {
  await apiRequest("POST", "/api/auth/logout");
}

export async function getCurrentUser() {
  try {
    const res = await apiRequest("GET", "/api/auth/me");
    return await res.json();
  } catch (error) {
    // If the user is not logged in, return null
    return null;
  }
}
