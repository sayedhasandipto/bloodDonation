"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { donationService } from "@/services/api";
import Link from "next/link";
import { Clock, Eye, Edit, Trash2, Filter, Droplets } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyDonationRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchMyRequests = async () => {
    if (user?.email) {
      try {
        setLoading(true);
        const res = await donationService.getMyRequests(user.email);
        setRequests(res.data || []);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation request?")) {
      try {
        await donationService.deleteRequest(id);
        fetchMyRequests();
      } catch (error) {
        alert("Failed to delete request.");
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await donationService.updateRequestStatus(id, status);
      fetchMyRequests();
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === "all") return true;
    return req.donationStatus === filter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentItems = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Donation Requests</h1>
          <p className="text-gray-500">Track and manage your blood donation requests.</p>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="w-5 h-5 text-gray-400 group-focus-within:text-[#e11d48] transition-colors" />
          </div>
          <select 
            className="select select-bordered pl-10 bg-white text-gray-800 pr-10 shadow-sm border-gray-200 hover:border-[#e11d48] focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all w-full md:w-56 appearance-none cursor-pointer" 
            value={filter} 
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // reset to page 1 on filter change
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-0">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : currentItems.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Droplets className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No requests found</h3>
              <p className="text-gray-500 max-w-md mx-auto">You haven't made any blood donation requests that match this status.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-50">
                  <tr className="text-gray-500">
                    <th>Recipient Name</th>
                    <th>Location</th>
                    <th>Date & Time</th>
                    <th>Blood Group</th>
                    <th>Status</th>
                    <th>Donor Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(req => (
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
                        {req.donationStatus === 'inprogress' && req.donorName ? (
                          <div className="text-sm">
                            <p className="font-semibold">{req.donorName}</p>
                            <p className="text-gray-500 text-xs">{req.donorEmail}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2 items-center">
                          {req.donationStatus === 'inprogress' && (
                            <>
                              <button onClick={() => handleStatusChange(req._id, 'done')} className="btn btn-xs btn-success text-white">
                                Done
                              </button>
                              <button onClick={() => handleStatusChange(req._id, 'canceled')} className="btn btn-xs btn-error text-white">
                                Cancel
                              </button>
                            </>
                          )}
                          
                          {req.donationStatus === 'pending' && (
                            <>
                              <Link href={`/dashboard/my-donation-requests/${req._id}`} className="btn btn-xs btn-outline btn-info">
                                <Edit className="w-3 h-3" /> Edit
                              </Link>
                              <button onClick={() => handleDelete(req._id)} className="btn btn-xs btn-outline btn-error">
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </>
                          )}

                          <Link href={`/donation-requests/${req._id}`} className="btn btn-xs btn-outline">
                            <Eye className="w-3 h-3" /> View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center">
            <div className="join">
              <button 
                className="join-item btn btn-sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                «
              </button>
              <button className="join-item btn btn-sm">Page {currentPage} of {totalPages}</button>
              <button 
                className="join-item btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
