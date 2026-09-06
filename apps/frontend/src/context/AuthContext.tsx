import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.me();
      if (res.success && res.email) {
        // Decode user ID from token payload if possible
        let id = "";
        try {
          const payload = JSON.parse(atob(savedToken.split(".")[1]));
          id = payload.id;
        } catch {}
        setUser({ id, email: res.email });
      } else {
        logout();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      let id = "";
      try {
        const payload = JSON.parse(atob(res.token.split(".")[1]));
        id = payload.id;
      } catch {}
      setUser({ id, email });
    } else {
      throw new Error(res.message || "Login failed");
    }
  };

  const signup = async (email: string, password: string) => {
    const res = await authApi.signup(email, password);
    if (!res.success) {
      throw new Error(res.error || res.message || "Signup failed");
    }
    // Automatically log in after sign up
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
