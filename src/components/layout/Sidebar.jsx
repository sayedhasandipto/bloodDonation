"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  User, 
  Users, 
  Droplet, 
  PlusCircle, 
  List, 
  FileText,
  LogOut,
  Home
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const role = user.role || "donor";

  const adminLinks = [
    { name: "Admin Home", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "All Users", href: "/dashboard/all-users", icon: <Users className="w-5 h-5" /> },
    { name: "All Requests", href: "/dashboard/all-blood-donation-request", icon: <Droplet className="w-5 h-5" /> },
    { name: "Content Management", href: "/dashboard/content", icon: <FileText className="w-5 h-5" /> },
  ];

  const volunteerLinks = [
    { name: "Volunteer Home", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "All Requests", href: "/dashboard/all-blood-donation-request", icon: <Droplet className="w-5 h-5" /> },
    { name: "Content Management", href: "/dashboard/content", icon: <FileText className="w-5 h-5" /> },
  ];

  const donorLinks = [
    { name: "Donor Home", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "My Requests", href: "/dashboard/my-donation-requests", icon: <List className="w-5 h-5" /> },
    { name: "Create Request", href: "/dashboard/create-donation-request", icon: <PlusCircle className="w-5 h-5" /> },
  ];

  const links = role === "admin" ? adminLinks : role === "volunteer" ? volunteerLinks : donorLinks;

  return (
    <div className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#e11d48] rounded-lg flex items-center justify-center">
            <Droplet className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            Blood<span className="text-[#e11d48]">Connect</span>
          </span>
        </Link>
      </div>

      <div className="p-4 flex-1">
        <ul className="menu bg-white p-0 [&_li>*]:rounded-lg gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href}
                className={pathname === link.href ? "active bg-[#fff1f2] text-[#e11d48] font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}

          <div className="divider my-2"></div>

          <li>
            <Link 
              href="/dashboard/profile"
              className={pathname === "/dashboard/profile" ? "active bg-[#fff1f2] text-[#e11d48] font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          </li>
          
          <li>
            <Link href="/" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <Home className="w-5 h-5" />
              Main Website
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="btn btn-outline btn-error w-full gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
