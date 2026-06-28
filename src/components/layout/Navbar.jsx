"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Droplet, Menu } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile dropdown */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <Menu className="w-5 h-5" />
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52">
            <li><Link href="/donation-requests">Donation Requests</Link></li>
            <li><Link href="/search">Search Donors</Link></li>
            {user && <li><Link href="/funding">Funding</Link></li>}
            {!user ? (
              <>
                <li><Link href="/login">Log In</Link></li>
                <li><Link href="/register" className="text-[#e11d48]">Join as Donor</Link></li>
              </>
            ) : (
              <>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><button onClick={logout} className="text-red-500">Log Out</button></li>
              </>
            )}
          </ul>
        </div>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-2">
          <div className="w-9 h-9 bg-[#e11d48] rounded-lg flex items-center justify-center">
            <Droplet className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            Blood<span className="text-[#e11d48]">Connect</span>
          </span>
        </Link>
      </div>

      {/* Navbar Center - Desktop Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link href="/donation-requests" className="text-gray-700 font-medium hover:text-[#e11d48]">
              Donation Requests
            </Link>
          </li>
          <li>
            <Link href="/search" className="text-gray-700 font-medium hover:text-[#e11d48]">
              Search Donors
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/funding" className="text-gray-700 font-medium hover:text-[#e11d48]">
                Funding
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        {!user ? (
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm text-gray-700 font-medium">
              Log In
            </Link>
            <Link href="/register" className="btn btn-sm bg-[#e11d48] hover:bg-[#be123c] text-white font-medium border-none">
              Join as Donor
            </Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring-2 ring-[#e11d48] ring-offset-2">
                <img
                  alt={user.name || "User avatar"}
                  src={user.avatar || "https://i.ibb.co/CpDtbhR/default-avatar.png"}
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52">
              <li className="px-4 py-2 pointer-events-none">
                <span className="text-xs text-gray-400 p-0">Signed in as</span>
                <span className="text-sm font-bold text-gray-800 p-0">{user.email}</span>
              </li>
              <div className="divider my-0"></div>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><button onClick={logout} className="text-red-500">Log Out</button></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
