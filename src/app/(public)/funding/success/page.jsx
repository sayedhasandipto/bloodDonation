"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { paymentService } from "@/services/api";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasRecorded = useRef(false);

  const sessionId = searchParams.get("session_id");
  const amount = searchParams.get("amount");

  useEffect(() => {
    const recordPayment = async () => {
      if (!sessionId || hasRecorded.current) return;
      hasRecorded.current = true;

      try {
        const newFund = {
          name: user?.name || "Anonymous",
          email: user?.email || "anonymous@example.com",
          amount: Number(amount) || 0,
          type: "One-time",
          stripeSessionId: sessionId
        };

        await paymentService.createPayment(newFund);
      } catch (err) {
        console.error("Failed to record payment in DB:", err);
        setError("Your payment was successful, but we had trouble updating our records. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    if (user !== undefined) {
      recordPayment();
    }
  }, [sessionId, amount, user]);

  return (
    <div className="bg-gray-50 min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
        
        {loading ? (
          <div className="py-10">
            <span className="loading loading-spinner loading-lg text-green-500 mb-4"></span>
            <p className="text-gray-500 font-medium">Verifying your contribution...</p>
          </div>
        ) : (
          <>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              {error ? error : "Thank you for your generous donation. Every penny goes towards saving a life and maintaining our platform."}
            </p>
            
            {amount && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-1">Amount Donated</p>
                <p className="text-3xl font-bold text-gray-900">${amount}</p>
              </div>
            )}
            
            <button 
              onClick={() => router.push('/funding')}
              className="btn bg-gray-900 hover:bg-gray-800 text-white w-full h-14 text-lg border-none shadow-lg shadow-gray-900/20 group rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Funding Page
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><span className="loading loading-spinner text-green-500"></span></div>}>
      <SuccessContent />
    </Suspense>
  );
}
