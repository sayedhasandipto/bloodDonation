"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Heart, DollarSign, Activity, Users, ArrowRight } from "lucide-react";
import { paymentService } from "@/services/api";

export default function FundingPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [amount, setAmount] = useState("");
  
  const [recentFunds, setRecentFunds] = useState([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [totalDonors, setTotalDonors] = useState(0);

  // Protect the route
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Fetch data dynamically from MongoDB
  const fetchFunds = async () => {
    try {
      setFetching(true);
      const res = await paymentService.getAllPayments();
      const fundsData = res.data || [];
      
      setRecentFunds(fundsData);
      
      // Calculate totals
      const raised = fundsData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      setTotalRaised(raised);
      
      // Calculate unique donors based on name/email
      const uniqueNames = new Set(fundsData.map(f => f.name));
      setTotalDonors(uniqueNames.size);
      
    } catch (error) {
      console.error("Failed to fetch funds:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    
    setLoading(true);
    
    try {
      const newFund = {
        name: user.name || "Anonymous",
        email: user.email,
        amount: Number(amount),
        type: "One-time"
      };
      
      // Post to MongoDB dynamically
      await paymentService.createPayment(newFund);
      
      // Refresh the data
      await fetchFunds();
      
      setAmount("");
      alert("Thank you for your generous donation!");
    } catch (error) {
      alert("Failed to process donation");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-crimson-700 to-crimson-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mb-6 shadow-xl">
            <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Power the Lifeline
          </h1>
          <p className="text-lg md:text-xl text-crimson-100 max-w-2xl mx-auto leading-relaxed">
            Your financial support helps us maintain our platform, organize blood donation camps, and keep the database running to save more lives.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Donation Form Card */}
          <div className="lg:col-span-1">
            <div className="card bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden sticky top-24">
              <div className="h-2 bg-crimson-600 w-full"></div>
              <div className="card-body p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Make a Contribution</h2>
                <p className="text-gray-500 text-sm mb-6">Every single penny goes towards saving a life.</p>
                
                <form onSubmit={handleDonate} className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Amount (USD)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input input-bordered w-full pl-11 h-14 text-lg font-semibold bg-gray-50 text-gray-900 focus:bg-white focus:border-crimson-500 focus:ring-2 focus:ring-crimson-200 transition-all"
                        placeholder="50"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[10, 50, 100].map(val => (
                      <button 
                        key={val}
                        type="button"
                        onClick={() => setAmount(val.toString())}
                        className={`py-2 rounded-lg font-medium transition-colors ${amount === val.toString() ? 'bg-crimson-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>

                  <button 
                    type="submit" 
                    className="btn bg-crimson-600 hover:bg-crimson-700 text-white w-full h-14 text-lg border-none shadow-lg shadow-crimson-500/30 group"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        Donate Now
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                  <Activity className="w-4 h-4" /> Secure SSL Encrypted Transaction
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Table */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 lg:mt-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-gray-500 font-medium text-sm">Total Raised</p>
                  <h3 className="text-3xl font-extrabold text-gray-900">${totalRaised.toLocaleString()}</h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-gray-500 font-medium text-sm">Total Donors</p>
                  <h3 className="text-3xl font-extrabold text-gray-900">{totalDonors}</h3>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-800">Recent Contributions</h3>
                <span className="badge bg-crimson-100 text-crimson-700 font-bold border-none">Live Updates</span>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-white text-gray-500 text-sm">
                      <th className="font-semibold py-4 px-6">Donor Name</th>
                      <th className="font-semibold py-4">Amount</th>
                      <th className="font-semibold py-4">Date</th>
                      <th className="font-semibold py-4">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetching ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10">
                          <span className="loading loading-spinner loading-lg text-crimson-600"></span>
                        </td>
                      </tr>
                    ) : recentFunds.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-gray-500">
                          No funds yet. Be the first to donate!
                        </td>
                      </tr>
                    ) : (
                      recentFunds.map((fund, index) => (
                        <tr key={fund._id || index} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-green-50/30' : ''}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                                {fund.name ? fund.name.charAt(0) : "A"}
                              </div>
                              <span className="font-bold text-gray-800">{fund.name || "Anonymous"}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="font-extrabold text-green-600">${fund.amount}</span>
                          </td>
                          <td className="py-4 text-gray-500 text-sm">
                            {fund.createdAt ? new Date(fund.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Just now"}
                          </td>
                          <td className="py-4">
                            <span className="badge badge-sm badge-ghost font-medium text-gray-600">{fund.type}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
