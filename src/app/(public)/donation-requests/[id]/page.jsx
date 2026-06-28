"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { donationService } from "@/services/api";
import { MapPin, Calendar, Clock, Heart, Droplet, Hospital, User, Info } from "lucide-react";

export default function RequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donateLoading, setDonateLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    const fetchDetails = async () => {
      try {
        const { data } = await donationService.getAllRequests();
        const req = data.find(r => r._id === params.id);
        if (req) {
          setRequest(req);
        }
      } catch (error) {
        console.error("Error fetching request:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDetails();
    }
  }, [user, authLoading, params.id, router]);

  const handleDonateConfirm = async () => {
    setDonateLoading(true);
    try {
      const donorInfo = { name: user.name, email: user.email };
      await donationService.updateRequestStatus(request._id, "inprogress", donorInfo);
      setRequest({ ...request, donationStatus: "inprogress", donorInfo });
      setShowModal(false);
    } catch (error) {
      console.error("Error confirming donation:", error);
    } finally {
      setDonateLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-error"></span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200 text-xl font-bold text-gray-500">
        Request not found
      </div>
    );
  }

  return (
    <div className="bg-base-200 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-8 md:p-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-base-200 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-crimson-100 flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-crimson-600 fill-crimson-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Blood Request</h1>
                  <p className="text-gray-500 mt-1">Requested by: <span className="font-semibold">{request.requesterName}</span></p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500 block mb-1">Blood Group Needed</span>
                <span className="text-3xl font-black text-crimson-700">{request.bloodGroup}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <h3 className="text-lg font-bold border-l-4 border-crimson-600 pl-3">Recipient Details</h3>
                
                <div className="flex items-start gap-4">
                  <User className="w-6 h-6 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="font-semibold text-lg">{request.recipientName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Hospital className="w-6 h-6 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Hospital</p>
                    <p className="font-semibold">{request.hospitalName}</p>
                    <p className="text-gray-600 mt-1">{request.fullAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{request.recipientUpazila}, {request.recipientDistrict}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold border-l-4 border-crimson-600 pl-3">Donation Schedule & Info</h3>
                
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">{new Date(request.donationDate).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold">{request.donationTime}</p>
                  </div>
                </div>
                <div className="alert alert-info">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-1">Message from Requester</p>
                    <p className="text-sm">{request.requestMessage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-base-200">
              <span className={`badge badge-lg ${request.donationStatus === "pending" ? "badge-warning" : "badge-success"}`}>
                Status: {request.donationStatus.toUpperCase()}
              </span>
              
              {request.donationStatus === "pending" && (
                <button onClick={() => setShowModal(true)} className="btn bg-crimson-600 hover:bg-crimson-700 text-white border-none shadow-lg btn-lg">
                  <Heart className="w-5 h-5 mr-2" /> Donate Blood
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Donation Modal */}
        {showModal && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-xl mb-4">Confirm Donation</h3>
              <p className="text-gray-600 mb-4">
                Please confirm your details to proceed with the blood donation for <span className="font-bold">{request.recipientName}</span>.
              </p>
              
              <div className="form-control mb-3">
                <label className="label"><span className="label-text">Donor Name</span></label>
                <input type="text" className="input input-bordered w-full" value={user?.name || ""} readOnly />
              </div>
              <div className="form-control mb-3">
                <label className="label"><span className="label-text">Donor Email</span></label>
                <input type="email" className="input input-bordered w-full" value={user?.email || ""} readOnly />
              </div>

              <div className="alert alert-warning text-sm mt-4">
                <Info className="w-5 h-5 flex-shrink-0" />
                <span>By confirming, you commit to being present at {request.hospitalName} on {new Date(request.donationDate).toLocaleDateString()} at {request.donationTime}.</span>
              </div>

              <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn bg-crimson-600 hover:bg-crimson-700 text-white border-none" onClick={handleDonateConfirm} disabled={donateLoading}>
                  {donateLoading ? <span className="loading loading-spinner loading-sm"></span> : "Confirm Donation"}
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setShowModal(false)}>close</button>
            </form>
          </dialog>
        )}
      </div>
    </div>
  );
}
