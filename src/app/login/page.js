"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Droplet } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || "Failed to login. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="card w-full max-w-md bg-white border border-gray-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="w-16 h-16 bg-[#e11d48] rounded-full flex items-center justify-center shadow-lg mb-2">
            <Droplet className="text-white w-8 h-8" />
          </div>
          <h2 className="card-title text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500">Sign in to your account</p>

          <form onSubmit={handleLogin} className="w-full mt-4 space-y-4 text-left">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Email</span>
              </label>
              <input 
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Password</span>
              </label>
              <input 
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className={`btn bg-[#e11d48] hover:bg-[#be123c] border-none text-white w-full mt-4 ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#e11d48] font-bold hover:underline">
              Create one here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
