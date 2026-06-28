"use client";

import { useState, useEffect } from "react";
import { donationService } from "@/services/api";
import Link from "next/link";
import { Activity, Clock, Heart, ArrowRight, FileText } from "lucide-react";

export default function DonorDashboard({ user }) {
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await donationService.getMyRequests(user.email);
        // Show only latest 3
        setRecentRequests(data.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  return (
    <div className="space-y-6">
      
      {/* Quick Stats/Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Become a Hero</h3>
          <p className="text-gray-500 text-sm mt-2 mb-4">Find someone in need and donate blood today.</p>
          <Link href="/donation-requests" className="btn btn-sm btn-outline text-blue-600 w-full">Find Requests</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-[#fff1f2] text-[#e11d48] rounded-full flex items-center justify-center mb-4">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Need Blood?</h3>
          <p className="text-gray-500 text-sm mt-2 mb-4">Create a new blood donation request instantly.</p>
          <Link href="/dashboard/create-request" className="btn btn-sm bg-[#e11d48] hover:bg-[#be123c] text-white w-full border-none">Create Request</Link>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">My Requests</h3>
          <p className="text-gray-500 text-sm mt-2 mb-4">Manage and track your existing blood requests.</p>
          <Link href="/dashboard/my-requests" className="btn btn-sm btn-outline text-emerald-600 w-full">View All</Link>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" /> Recent Donation Requests
          </h2>
          <Link href="/dashboard/my-requests" className="text-sm font-semibold text-[#e11d48] hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="p-0">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : recentRequests.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              You haven't made any blood requests yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-white">
                  <tr className="text-gray-500">
                    <th>Recipient</th>
                    <th>Location</th>
                    <th>Date & Time</th>
                    <th>Blood Group</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map(req => (
                    <tr key={req._id} className="hover:bg-gray-50">
                      <td className="font-medium text-gray-800">{req.recipientName}</td>
                      <td className="text-gray-600 text-sm">{req.recipientUpazila}, {req.recipientDistrict}</td>
                      <td className="text-gray-600 text-sm">
                        {new Date(req.donationDate).toLocaleDateString()}<br/>
                        <span className="text-xs text-gray-400">{req.donationTime}</span>
                      </td>
                      <td>
                        <span className="font-bold text-[#e11d48] bg-[#fff1f2] px-2 py-1 rounded text-sm">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-sm ${req.donationStatus === 'pending' ? 'badge-warning' : req.donationStatus === 'inprogress' ? 'badge-info text-white' : req.donationStatus === 'done' ? 'badge-success text-white' : 'badge-error text-white'}`}>
                          {req.donationStatus}
                        </span>
                      </td>
                      <td>
                        <Link href={`/dashboard/my-requests/${req._id}`} className="btn btn-xs btn-outline">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
