"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/api";
import { getDistricts, getUpazilas } from "@/services/locations";
import { User, MapPin, Mail, Droplet, Camera, CheckCircle, Lock } from "lucide-react";

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
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        
        <div className="relative">
          {/* Header Cover */}
          <div 
            className="h-[200px] bg-[#3a0a14] w-full pt-[130px] px-8 md:px-12 flex justify-between relative"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          >
             <div className="ml-[140px] sm:ml-[160px] flex items-center gap-4 z-10 relative">
                <h1 className="text-3xl md:text-4xl font-black text-white">{user.name}</h1>
                <span className="hidden sm:flex items-center gap-1 bg-white text-[#2e7d32] px-3 py-1 rounded-full text-[10px] font-black shadow-sm tracking-wide">
                  <CheckCircle className="w-3.5 h-3.5" /> ACTIVE DONOR
                </span>
             </div>
          </div>

          <div className="px-6 md:px-12 pb-12 relative">
            {/* Avatar */}
            <div className="absolute -top-[70px] left-6 md:left-12 z-20">
              <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full border-[6px] border-white bg-white shadow-md overflow-hidden relative">
                <img 
                  src={user.avatar || "https://i.ibb.co/CpDtbhR/default-avatar.png"} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                   <label className="absolute bottom-2 right-2 w-8 h-8 bg-[#e11d48] rounded-full text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#be123c] transition-colors">
                     <Camera className="w-4 h-4" />
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
                   </label>
                )}
              </div>
            </div>

            {/* Blood Group Badge (Top Right) */}
            <div className="absolute -top-[60px] right-6 md:right-12 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl px-6 py-4 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-w-[120px] hidden md:block z-20">
              <p className="text-[10px] font-black text-[#e11d48] tracking-[0.15em] mb-1">BLOOD GROUP</p>
              <p className="text-4xl font-black text-[#e11d48]">{user.bloodGroup || "N/A"}</p>
            </div>

            {/* Location & Edit Button */}
            <div className="pl-[130px] sm:pl-[160px] pt-3 flex flex-col sm:flex-row sm:items-center justify-between mb-12 md:mb-16 gap-4">
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <MapPin className="w-4 h-4 mr-1 text-[#e11d48]" />
                {user.upazila || "Location"}, {user.district || "Not Set"}
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`btn btn-sm px-6 rounded-xl ${isEditing ? 'btn-ghost' : 'bg-[#e11d48] hover:bg-[#be123c] text-white border-none'}`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {error && <div className="alert alert-error mb-8 rounded-xl">{error}</div>}
            {success && <div className="alert alert-success mb-8 text-white rounded-xl">{success}</div>}

            {!isEditing ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-12">
                  {/* Personal Information */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-[#fff1f2] text-[#e11d48] flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 ml-1">Full Name</label>
                        <div className="bg-gray-50/80 px-5 py-4 rounded-2xl text-gray-800 font-bold text-sm border border-gray-100">
                          {user.name}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 ml-1">Email (Fixed)</label>
                        <div className="bg-gray-50/80 px-5 py-4 rounded-2xl text-gray-500 font-bold text-sm border border-gray-100 flex justify-between items-center">
                          <span className="truncate">{user.email}</span>
                          <Lock className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-[#fff1f2] text-[#e11d48] flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 ml-1">District</label>
                        <div className="bg-gray-50/80 px-5 py-4 rounded-2xl text-gray-800 font-bold text-sm border border-gray-100">
                          {user.district || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 ml-1">Upazila</label>
                        <div className="bg-gray-50/80 px-5 py-4 rounded-2xl text-gray-800 font-bold text-sm border border-gray-100">
                          {user.upazila || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 h-full">
                    <div className="flex flex-col gap-2 mb-8">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm text-[#e11d48] flex items-center justify-center border border-gray-100">
                        <Droplet className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mt-2">Medical Profile</h2>
                    </div>
                    
                    <div className="mb-10">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Blood Group</label>
                      <div className="text-[#e11d48] font-black text-2xl">
                        {user.bloodGroup || "N/A"}
                      </div>
                    </div>

                    <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm leading-tight">Eligible to<br/>Donate</h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                        Your account is in good standing. You are ready to save lives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="bg-gray-50/50 p-6 md:p-8 rounded-[2rem] border border-gray-100 mt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Edit Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label"><span className="label-text text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</span></label>
                    <input 
                      type="text" 
                      className="input input-bordered w-full bg-white text-gray-800 rounded-xl" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label"><span className="label-text text-xs font-bold text-gray-400 uppercase tracking-wider">Blood Group</span></label>
                    <select 
                      className="select select-bordered w-full bg-white text-gray-800 rounded-xl" 
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
                    <label className="label"><span className="label-text text-xs font-bold text-gray-400 uppercase tracking-wider">District</span></label>
                    <select 
                      className="select select-bordered w-full bg-white text-gray-800 rounded-xl" 
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
                    <label className="label"><span className="label-text text-xs font-bold text-gray-400 uppercase tracking-wider">Upazila</span></label>
                    <select 
                      className="select select-bordered w-full bg-white text-gray-800 rounded-xl" 
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

                <div className="mt-10 flex justify-end gap-4">
                  <button type="button" className="btn btn-ghost rounded-xl" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none px-8 rounded-xl shadow-sm" disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
