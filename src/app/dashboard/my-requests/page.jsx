"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { donationService } from "@/services/api";
import { Droplet, MapPin, Calendar, Clock, Activity, FileText } from "lucide-react";

export default function MyRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      if (user?.email) {
        try {
          const res = await donationService.getMyRequests(user.email);
          setRequests(res.data || []);
        } catch (error) {
          console.error("Failed to fetch requests", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMyRequests();
  }, [user]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'badge-warning';
      case 'inprogress': return 'badge-info';
      case 'done': return 'badge-success';
      case 'canceled': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><span className="loading loading-spinner text-[#e11d48]"></span></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Donation Requests</h1>
          <p className="text-gray-500">Track and manage your blood donation requests.</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No requests found</h3>
          <p className="text-gray-500 mt-2">You haven't made any blood donation requests yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-[#e11d48]" />
                  <span className="font-bold text-[#e11d48]">{request.bloodGroup}</span>
                </div>
                <span className={`badge badge-sm text-white capitalize ${getStatusColor(request.donationStatus)}`}>
                  {request.donationStatus}
                </span>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{request.recipientName}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{request.requestMessage}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{request.hospitalName}, {request.recipientUpazila}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{request.donationDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{request.donationTime}</span>
                  </div>
                </div>
                
                {request.donorInfo && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Donor Information</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {request.donorInfo.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{request.donorInfo.name}</p>
                        <p className="text-xs text-gray-500">{request.donorInfo.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
