import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { MinoLogo } from "@/components/common/MinoLogo";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token) {
      loginWithToken(token)
        .then(() => {
          navigate("/dashboard", { replace: true });
        })
        .catch((err) => {
          console.error("Failed to authenticate with token:", err);
          navigate("/login?error=oauth_failed", { replace: true });
        });
    } else {
      navigate("/login?error=oauth_failed", { replace: true });
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0b0f19] text-white">
      <div className="relative flex flex-col items-center gap-4">
        <MinoLogo size={52} className="animate-pulse shadow-lg shadow-blue-500/30" />
        <div className="flex items-center gap-2 mt-4 text-slate-400 text-sm">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Signing you in with Google...</span>
        </div>
      </div>
    </div>
  );
}
