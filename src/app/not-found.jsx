"use client";

import Link from "next/link";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-white border-4 border-[#e11d48] text-[#e11d48] w-32 h-32 rounded-full flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-16 h-16" />
          </div>
        </div>
        
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! The page you are looking for doesn't exist or has been moved. 
          Let's get you back on track to save lives.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none rounded-xl px-6 gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl px-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
