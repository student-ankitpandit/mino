import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { profilePicture?: string | null; name?: string | null }) => Promise<void>;
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
        let id = res.id || "";
        if (!id) {
          try {
            const payload = JSON.parse(atob(savedToken.split(".")[1]));
            id = payload.id;
          } catch {}
        }
        setUser({
          id,
          email: res.email,
          profilePicture: res.profilePicture || null,
          name: res.name || null,
          googleId: res.googleId || null,
        });
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
      // Fetch full profile in background
      try {
        const meRes = await authApi.me();
        if (meRes.success) {
          setUser({
            id: meRes.id || id,
            email: meRes.email,
            profilePicture: meRes.profilePicture || null,
            name: meRes.name || null,
            googleId: meRes.googleId || null,
          });
        }
      } catch {}
    } else {
      throw new Error(res.message || "Login failed");
    }
  };

  const loginWithToken = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    try {
      const meRes = await authApi.me();
      if (meRes.success && meRes.email) {
        let id = meRes.id || "";
        if (!id) {
          try {
            const payload = JSON.parse(atob(newToken.split(".")[1]));
            id = payload.id;
          } catch {}
        }
        setUser({
          id,
          email: meRes.email,
          profilePicture: meRes.profilePicture || null,
          name: meRes.name || null,
          googleId: meRes.googleId || null,
        });
      }
    } catch (err) {
      console.error("Token login failed:", err);
      logout();
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

  const updateProfile = async (data: { profilePicture?: string | null; name?: string | null }) => {
    const res = await authApi.updateProfile(data);
    if (res.success && res.data) {
      setUser((prev) => (prev ? { ...prev, ...res.data } : prev));
    } else {
      throw new Error(res.error || res.message || "Failed to update profile");
    }
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
        loginWithToken,
        signup,
        logout,
        refreshUser,
        updateProfile,
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
