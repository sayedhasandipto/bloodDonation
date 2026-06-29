"use client";

import { useState } from "react";
import { FileText, Plus, Edit, Trash2, Eye, EyeOff, X, BookOpen } from "lucide-react";

const INITIAL_BLOGS = [
  {
    id: 1,
    title: "Benefits of Donating Blood",
    content: "Blood donation is a simple yet powerful act that can save up to three lives per donation. Regular blood donors also enjoy health benefits including reduced risk of heart disease and cancer screening.",
    status: "published",
    date: "2026-06-25",
    author: "Admin",
  },
  {
    id: 2,
    title: "How to Prepare for Blood Donation",
    content: "Before donating blood, make sure to drink plenty of water, eat a healthy meal, avoid fatty foods, and get a good night's sleep. Wear comfortable clothing with sleeves that roll up easily.",
    status: "draft",
    date: "2026-06-27",
    author: "Admin",
  },
];

export default function ContentManagementPage() {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", status: "draft" });

  const openCreateModal = () => {
    setEditingBlog(null);
    setForm({ title: "", content: "", status: "draft" });
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setForm({ title: blog.title, content: blog.content, status: blog.status });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;

    if (editingBlog) {
      setBlogs(blogs.map(b =>
        b.id === editingBlog.id
          ? { ...b, title: form.title, content: form.content, status: form.status }
          : b
      ));
    } else {
      const newBlog = {
        id: Date.now(),
        title: form.title,
        content: form.content,
        status: form.status,
        date: new Date().toISOString().split("T")[0],
        author: "Admin",
      };
      setBlogs([newBlog, ...blogs]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setBlogs(blogs.map(b =>
      b.id === id
        ? { ...b, status: b.status === "published" ? "draft" : "published" }
        : b
    ));
  };

  const publishedCount = blogs.filter(b => b.status === "published").length;
  const draftCount = blogs.filter(b => b.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#e11d48]" />
            Content Management
          </h1>
          <p className="text-gray-500 mt-1">Manage blogs, articles, and site content.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add New Blog
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Posts</p>
            <p className="text-2xl font-bold text-gray-800">{blogs.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Published</p>
            <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
            <EyeOff className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Drafts</p>
            <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
          </div>
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#e11d48]" />
          <h2 className="text-xl font-bold text-gray-800">Blog Posts</h2>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600">No Blog Posts Yet</h3>
            <p className="text-gray-400 mt-1">Click "Add New Blog" to create your first post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th>Title</th>
                  <th className="hidden md:table-cell">Author</th>
                  <th className="hidden md:table-cell">Date</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50">
                    <td>
                      <p className="font-medium text-gray-800 line-clamp-1">{blog.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{blog.content}</p>
                    </td>
                    <td className="hidden md:table-cell text-gray-500 text-sm">{blog.author}</td>
                    <td className="hidden md:table-cell text-gray-500 text-sm">{blog.date}</td>
                    <td>
                      <span className={`badge badge-sm capitalize ${
                        blog.status === "published"
                          ? "badge-success text-white"
                          : "badge-warning text-white"
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(blog.id)}
                          className={`btn btn-xs btn-ghost ${
                            blog.status === "published" ? "text-yellow-600" : "text-green-600"
                          }`}
                          title={blog.status === "published" ? "Unpublish" : "Publish"}
                        >
                          {blog.status === "published"
                            ? <EyeOff className="w-4 h-4" />
                            : <Eye className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={() => openEditModal(blog)}
                          className="btn btn-xs btn-ghost text-blue-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="btn btn-xs btn-ghost text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fff1f2] rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#e11d48]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter blog title..."
                  className="input input-bordered w-full bg-white text-gray-900 focus:border-[#e11d48]"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Content *</span>
                </label>
                <textarea
                  placeholder="Write your blog content here..."
                  rows={6}
                  className="textarea textarea-bordered w-full bg-white text-gray-900 focus:border-[#e11d48] resize-none"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Status</span>
                </label>
                <div className="flex gap-4">
                  {["draft", "published"].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        className="radio radio-sm checked:bg-[#e11d48] checked:border-[#e11d48]"
                        checked={form.status === s}
                        onChange={() => setForm({ ...form, status: s })}
                      />
                      <span className="capitalize text-gray-700 font-medium">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || !form.content.trim()}
                className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none px-8 disabled:opacity-50"
              >
                {editingBlog ? "Save Changes" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
