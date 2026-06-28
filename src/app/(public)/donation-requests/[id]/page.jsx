"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { donationService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Clock, Droplet, User, AlertCircle, CheckCircle } from "lucide-react";
import { use } from "react";

export default function DonationRequestDetails({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    // According to requirements: "If the user is not logged in then redirect the user to the login page"
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const { data } = await donationService.getRequestById(id);
      setRequest(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequestDetails();
    }
  }, [id, user]);

  const handleDonateConfirm = async (e) => {
    e.preventDefault();
    setDonating(true);
    try {
      const donorInfo = {
        name: user.name,
        email: user.email,
      };
      // Status changes pending to inprogress
      await donationService.updateRequestStatus(id, "inprogress", donorInfo);
      alert("Thank you! You have committed to donate blood.");
      setShowModal(false);
      fetchRequestDetails();
    } catch (error) {
      alert("Failed to confirm donation.");
    } finally {
      setDonating(false);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner text-[#e11d48] loading-lg"></span></div>;
  if (!user || !request) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#fff1f2] p-8 border-b border-red-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-6 h-6 text-[#e11d48] fill-[#e11d48]" />
                <h1 className="text-3xl font-bold text-gray-900">Blood Request</h1>
              </div>
              <p className="text-[#e11d48] font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> URGENT NEED
              </p>
            </div>
            <div className="bg-white px-6 py-4 rounded-xl shadow-sm text-center border border-red-100">
              <p className="text-sm text-gray-500 font-semibold mb-1">Blood Group Needed</p>
              <h2 className="text-4xl font-extrabold text-[#e11d48]">{request.bloodGroup}</h2>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Patient Details</h3>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{request.recipientName}</p>
                      <p className="text-gray-600 text-sm">Recipient Name</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Hospital & Location</h3>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">{request.hospitalName}</p>
                      <p className="text-gray-600 text-sm">{request.fullAddress}</p>
                      <p className="text-gray-500 text-xs mt-1">{request.recipientUpazila}, {request.recipientDistrict}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Time & Date</h3>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">{new Date(request.donationDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-gray-600 text-sm">{request.donationTime}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact Details</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-600 text-sm mb-1">Requested By:</p>
                    <p className="font-bold text-gray-900">{request.requesterName}</p>
                    <p className="text-gray-500 text-sm">{request.requesterEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Message from requester</h3>
              <div className="bg-[#f8fafc] border-l-4 border-[#e11d48] p-5 rounded-r-xl">
                <p className="text-gray-700 italic">"{request.requestMessage}"</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center">
              {request.donationStatus === "pending" ? (
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none w-full md:w-auto md:px-16 h-14 text-lg shadow-lg shadow-red-200"
                >
                  <Droplet className="w-5 h-5 mr-2" /> Donate Now
                </button>
              ) : (
                <div className="bg-gray-100 text-gray-600 px-8 py-4 rounded-xl flex items-center gap-3 font-semibold w-full justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  This request is currently {request.donationStatus}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Donate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-[#fff1f2] p-6 border-b border-red-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-900">Confirm Donation</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-sm btn-circle btn-ghost">✕</button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">You are about to commit to donating blood. Please review your details below.</p>
              
              <form onSubmit={handleDonateConfirm} className="space-y-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-gray-700">Donor Name</span></label>
                  <input type="text" value={user.name} readOnly className="input input-bordered bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-gray-700">Donor Email</span></label>
                  <input type="email" value={user.email} readOnly className="input input-bordered bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>

                <button 
                  type="submit" 
                  className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none w-full mt-4"
                  disabled={donating}
                >
                  {donating ? <span className="loading loading-spinner"></span> : "Confirm Donation"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
