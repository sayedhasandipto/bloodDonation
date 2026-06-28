"use client";

import { useState, useEffect } from "react";
import { donationService } from "@/services/api";
import { Calendar, Clock, MapPin, Droplet, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await donationService.getPendingRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="bg-base-200 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Urgent Blood Requests</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These individuals are currently in urgent need of blood. Your donation can save a life today.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-error"></span>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 card bg-base-100 shadow-sm">
            <div className="card-body items-center">
              <Droplet className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold">No Pending Requests</h3>
              <p className="text-gray-500 mt-2">There are currently no urgent blood requests.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request, idx) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="card bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 h-full border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="card-body p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                          <Droplet className="w-6 h-6 text-[#e11d48] fill-[#e11d48]" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Blood Group</span>
                          <span className="text-2xl font-extrabold text-gray-900 block mt-0.5">{request.bloodGroup}</span>
                        </div>
                      </div>
                      <span className="badge bg-amber-100 text-amber-700 border-none font-bold px-4 py-3 rounded-xl text-xs">Pending</span>
                    </div>

                    <div className="space-y-4 mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="font-bold text-gray-900 text-base">{request.recipientName}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-700 leading-snug">{request.recipientUpazila}, {request.recipientDistrict}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">{new Date(request.donationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">{request.donationTime}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Link 
                        href={`/donation-requests/${request._id}`}
                        className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none w-full h-12 rounded-xl text-base shadow-md shadow-red-200 group"
                      >
                        View Details 
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
