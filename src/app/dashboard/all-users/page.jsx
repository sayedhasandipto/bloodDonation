"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/api";
import { Users, MoreVertical, Shield, User as UserIcon, Activity, Ban } from "lucide-react";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getAllUsers();
        setUsers(res.data || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await userService.updateUserRole(id, newRole);
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await userService.updateUserStatus(id, newStatus);
      setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><span className="loading loading-spinner text-[#e11d48]"></span></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
          <p className="text-gray-500">Manage user roles and statuses.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={u.avatar || "https://i.ibb.co/CpDtbhR/default-avatar.png"} alt={u.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{u.name}</div>
                        <div className="text-sm opacity-50">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="dropdown dropdown-hover">
                      <div tabIndex={0} role="button" className={`badge badge-sm capitalize m-1 ${u.role === 'admin' ? 'badge-error text-white' : u.role === 'volunteer' ? 'badge-warning text-white' : 'badge-ghost'}`}>
                        {u.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                        {u.role === 'donor' && <UserIcon className="w-3 h-3 mr-1" />}
                        {u.role}
                      </div>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 border border-gray-100">
                        <li><button onClick={() => handleRoleChange(u._id, 'donor')}>Donor</button></li>
                        <li><button onClick={() => handleRoleChange(u._id, 'volunteer')}>Volunteer</button></li>
                        <li><button onClick={() => handleRoleChange(u._id, 'admin')} className="text-red-500 hover:bg-red-50">Admin</button></li>
                      </ul>
                    </div>
                  </td>
                  <td>
                    <div className={`badge badge-sm badge-outline capitalize ${u.status === 'active' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
                      {u.status}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {u.status === 'active' ? (
                        <button 
                          onClick={() => handleStatusChange(u._id, 'blocked')}
                          className="btn btn-xs btn-outline btn-error gap-1"
                        >
                          <Ban className="w-3 h-3" /> Block
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusChange(u._id, 'active')}
                          className="btn btn-xs btn-outline btn-success gap-1"
                        >
                          <Activity className="w-3 h-3" /> Unblock
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
