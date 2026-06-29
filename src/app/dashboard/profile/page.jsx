"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/api";
import { getDistricts, getUpazilas } from "@/services/locations";
import { User, MapPin, Mail, Droplet, Camera } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    district: "",
    upazila: "",
  });
  
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bloodGroup: user.bloodGroup || "",
        district: user.district || "",
        upazila: user.upazila || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const loadLocations = async () => {
      const dists = await getDistricts();
      setDistricts(dists);
      if (user?.district) {
        const ups = await getUpazilas(user.district);
        setUpazilas(ups);
      }
    };
    loadLocations();
  }, [user]);

  const handleDistrictChange = async (e) => {
    const districtValue = e.target.value;
    setFormData({ ...formData, district: districtValue, upazila: "" });
    if (districtValue) {
      const ups = await getUpazilas(districtValue);
      setUpazilas(ups);
    } else {
      setUpazilas([]);
    }
  };

  const uploadToImageBB = async (file) => {
    const imgData = new FormData();
    imgData.append("image", file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY_HERE"; 
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgData,
    });
    const result = await response.json();
    if (result.success) {
      return result.data.display_url;
    }
    throw new Error("Failed to upload image");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let avatarUrl = user.avatar;
      if (avatarFile) {
        avatarUrl = await uploadToImageBB(avatarFile);
      }

      const updateData = {
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
        avatar: avatarUrl,
      };

      // Assuming updateUser in context calls API and updates local state
      await updateUser(updateData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500">Manage your account information and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-[#e11d48] to-[#9f1239]"></div>
        
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 mb-8 gap-4">
            <div className="flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={user.avatar || "https://i.ibb.co/CpDtbhR/default-avatar.png"} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 w-8 h-8 bg-[#e11d48] rounded-full text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#be123c] transition-colors">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
                  </label>
                )}
              </div>
              <div className="mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <span className={`badge badge-sm text-white capitalize ${user.role === 'admin' ? 'badge-error' : user.role === 'volunteer' ? 'badge-warning' : 'badge-success'}`}>
                    {user.role}
                  </span>
                  <span className={`badge badge-sm badge-outline capitalize ${user.status === 'active' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`btn ${isEditing ? 'btn-ghost' : 'bg-[#e11d48] hover:bg-[#be123c] text-white border-none'}`}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {error && <div className="alert alert-error mb-6">{error}</div>}
          {success && <div className="alert alert-success mb-6 text-white">{success}</div>}

          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact Information</h3>
                  <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-800">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Medical & Location</h3>
                  <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Droplet className="w-5 h-5 text-[#e11d48]" />
                      <div>
                        <p className="text-xs text-gray-500">Blood Group</p>
                        <p className="font-bold text-[#e11d48] text-lg">{user.bloodGroup || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium text-gray-800">{user.upazila}, {user.district}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Edit Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-gray-700">Full Name</span></label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full bg-white text-gray-800" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-gray-700">Blood Group</span></label>
                  <select 
                    className="select select-bordered w-full bg-white text-gray-800" 
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select Blood Group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-gray-700">District</span></label>
                  <select 
                    className="select select-bordered w-full bg-white text-gray-800" 
                    value={formData.district}
                    onChange={handleDistrictChange}
                    required
                  >
                    <option value="" disabled>Select District</option>
                    {districts.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-gray-700">Upazila</span></label>
                  <select 
                    className="select select-bordered w-full bg-white text-gray-800" 
                    value={formData.upazila}
                    onChange={(e) => setFormData({...formData, upazila: e.target.value})}
                    required
                    disabled={!formData.district}
                  >
                    <option value="" disabled>Select Upazila</option>
                    {upazilas.map((u) => (
                      <option key={u.name} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none px-8" disabled={loading}>
                  {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
