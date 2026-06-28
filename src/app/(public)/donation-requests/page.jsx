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
                <div className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow h-full border border-base-200">
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-crimson-100 flex items-center justify-center">
                          <Droplet className="w-5 h-5 text-crimson-600 fill-crimson-600" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">Blood Group</span>
                          <span className="text-xl font-bold text-crimson-700">{request.bloodGroup}</span>
                        </div>
                      </div>
                      <span className="badge badge-warning">Pending</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold">{request.recipientName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{request.recipientUpazila}, {request.recipientDistrict}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{new Date(request.donationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{request.donationTime}</span>
                      </div>
                    </div>

                    <Link 
                      href={`/donation-requests/${request._id}`}
                      className="btn btn-outline btn-error w-full group"
                    >
                      View Details 
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
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
