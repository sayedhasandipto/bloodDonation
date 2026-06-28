"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { donationService } from "@/services/api";
import { Droplet, MapPin, Calendar, Activity } from "lucide-react";
import Link from "next/link";

export default function AllRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const res = await donationService.getAllRequests();
        setRequests(res.data || []);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await donationService.updateRequestStatus(id, newStatus);
      setRequests(requests.map(r => r._id === id ? { ...r, donationStatus: newStatus } : r));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'badge-warning text-white';
      case 'inprogress': return 'badge-info text-white';
      case 'done': return 'badge-success text-white';
      case 'canceled': return 'badge-error text-white';
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
          <h1 className="text-3xl font-bold text-gray-800">All Donation Requests</h1>
          <p className="text-gray-500">Monitor and manage blood donation requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50">
              <tr>
                <th>Recipient & Blood</th>
                <th>Location & Date</th>
                <th>Requester</th>
                <th>Status</th>
                {user?.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/50">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#fff1f2] flex items-center justify-center flex-shrink-0">
                        <Droplet className="w-5 h-5 text-[#e11d48]" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{r.recipientName}</div>
                        <div className="text-sm font-semibold text-[#e11d48]">{r.bloodGroup}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]">{r.hospitalName}, {r.recipientUpazila}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{r.donationDate}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-gray-700">{r.requesterName}</div>
                    <div className="text-xs text-gray-500">{r.requesterEmail}</div>
                  </td>
                  <td>
                    <div className="dropdown dropdown-hover">
                      <div tabIndex={0} role="button" className={`badge badge-sm capitalize ${getStatusColor(r.donationStatus)}`}>
                        {r.donationStatus}
                      </div>
                      {(user?.role === 'admin' || user?.role === 'volunteer') && (
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36 border border-gray-100">
                          <li><button onClick={() => handleStatusChange(r._id, 'pending')}>Pending</button></li>
                          <li><button onClick={() => handleStatusChange(r._id, 'inprogress')}>In Progress</button></li>
                          <li><button onClick={() => handleStatusChange(r._id, 'done')} className="text-green-600">Done</button></li>
                          <li><button onClick={() => handleStatusChange(r._id, 'canceled')} className="text-red-600">Canceled</button></li>
                        </ul>
                      )}
                    </div>
                  </td>
                  {user?.role === 'admin' || user?.role === 'volunteer' ? (
                    <td>
                      <div className="flex gap-2">
                        {user?.role === 'admin' && (
                          <>
                            <Link href={`/dashboard/my-donation-requests/${r._id}`} className="btn btn-xs btn-outline btn-info">Edit</Link>
                            <button 
                              onClick={async () => {
                                if(window.confirm("Are you sure?")) {
                                  await donationService.deleteRequest(r._id);
                                  setRequests(requests.filter(req => req._id !== r._id));
                                }
                              }} 
                              className="btn btn-xs btn-outline btn-error"
                            >Delete</button>
                          </>
                        )}
                        <Link href={`/donation-requests/${r._id}`} className="btn btn-xs btn-outline">View</Link>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No donation requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
