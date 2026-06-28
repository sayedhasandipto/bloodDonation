"use client";

import { useState } from "react";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";

export default function ContentManagementPage() {
  const [blogs, setBlogs] = useState([
    { id: 1, title: "Benefits of Donating Blood", status: "published", date: "2026-06-25" },
    { id: 2, title: "How to Prepare for Blood Donation", status: "draft", date: "2026-06-27" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
          <p className="text-gray-500">Manage blogs, articles, and site content.</p>
        </div>
        <button className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none gap-2">
          <Plus className="w-4 h-4" />
          Add New Blog
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#e11d48]" />
            Recent Blog Posts
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50">
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/50">
                  <td className="font-medium text-gray-800">{blog.title}</td>
                  <td className="text-gray-500">{blog.date}</td>
                  <td>
                    <span className={`badge badge-sm capitalize ${blog.status === 'published' ? 'badge-success text-white' : 'badge-ghost'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button className="btn btn-xs btn-ghost text-blue-600"><Edit className="w-4 h-4" /></button>
                      <button className="btn btn-xs btn-ghost text-red-600"><Trash2 className="w-4 h-4" /></button>
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
