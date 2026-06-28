"use client";

import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "./components/AdminDashboard";
import DonorDashboard from "./components/DonorDashboard";

export default function DashboardHome() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-500">Here's what's happening with your account today.</p>
      </div>

      {(user.role === "admin" || user.role === "volunteer") ? (
        <AdminDashboard user={user} />
      ) : (
        <DonorDashboard user={user} />
      )}
    </div>
  );
}
