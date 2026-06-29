"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/api";
import { Users, Search, Shield, UserCheck, UserX, ChevronLeft, ChevronRight } from "lucide-react";

const ROLES = ["admin", "volunteer", "donor"];
const STATUSES = ["active", "blocked"];

export default function AllUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      setUsers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert("Failed to update user role.");
      console.error(error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await userService.updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (error) {
      alert("Failed to update user status.");
      console.error(error);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin": return "badge-error text-white";
      case "volunteer": return "badge-warning text-white";
      default: return "badge-success text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#e11d48]" />
            All Users
          </h1>
          <p className="text-gray-500 mt-1">
            Manage user roles and account statuses. Total: <span className="font-bold text-gray-700">{users.length}</span> users
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input input-bordered w-full pl-10 bg-white text-gray-900 focus:border-[#e11d48]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="select select-bordered w-full sm:w-48 bg-white text-gray-800"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Roles</option>
            {ROLES.map(r => (
              <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-[#e11d48]"></span>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600">No Users Found</h3>
            <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr className="text-gray-500 text-sm">
                  <th>#</th>
                  <th>User</th>
                  <th>Blood Group</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((u, idx) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 border-b border-gray-50">
                    <td className="text-gray-500 text-sm font-medium">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full ring-2 ring-gray-100 overflow-hidden">
                            <img
                              src={u.avatar || "https://i.ibb.co/CpDtbhR/default-avatar.png"}
                              alt={u.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {u.bloodGroup ? (
                        <span className="font-bold text-[#e11d48] bg-[#fff1f2] px-2 py-1 rounded text-sm">
                          {u.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="text-gray-600 text-sm">
                      {u.upazila && u.district
                        ? `${u.upazila}, ${u.district}`
                        : <span className="text-gray-400 text-xs">Not set</span>
                      }
                    </td>
                    <td>
                      <span className={`badge badge-sm capitalize ${getRoleBadgeClass(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-sm capitalize ${u.status === "active" ? "badge-success text-white" : "badge-error text-white"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      {/* Don't allow editing yourself */}
                      {u._id !== user?._id ? (
                        <div className="flex flex-wrap gap-2">
                          {/* Role change dropdown */}
                          <div className="dropdown dropdown-end">
                            <label
                              tabIndex={0}
                              className="btn btn-xs btn-outline btn-info gap-1 cursor-pointer"
                            >
                              <Shield className="w-3 h-3" />
                              Role
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[10] menu p-2 shadow-lg bg-white rounded-box w-36 border border-gray-100 mt-1"
                            >
                              {ROLES.map(role => (
                                <li key={role}>
                                  <button
                                    onClick={() => handleRoleChange(u._id, role)}
                                    className={`capitalize text-sm ${u.role === role ? "font-bold text-[#e11d48]" : ""}`}
                                  >
                                    {role}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Status toggle */}
                          {u.status === "active" ? (
                            <button
                              onClick={() => handleStatusChange(u._id, "blocked")}
                              className="btn btn-xs btn-outline btn-error gap-1"
                              title="Block User"
                            >
                              <UserX className="w-3 h-3" />
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(u._id, "active")}
                              className="btn btn-xs btn-outline btn-success gap-1"
                              title="Activate User"
                            >
                              <UserCheck className="w-3 h-3" />
                              Activate
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">You</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="join">
              <button
                className="join-item btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`join-item btn btn-sm ${currentPage === page ? "btn-active bg-[#e11d48] text-white border-[#e11d48]" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="join-item btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}