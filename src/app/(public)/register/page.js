"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Droplet } from "lucide-react";
import { getDistricts, getUpazilas } from "@/services/locations";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RegisterPage() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      const dists = await getDistricts();
      setDistricts(dists);
    };
    loadLocations();
  }, []);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadToImageBB = async (file) => {
    const imgData = new FormData();
    imgData.append("image", file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgData,
    });
    const result = await response.json();
    if (result.success) {
      return result.data.display_url;
    }
    throw new Error(result.error?.message || "Failed to upload image");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      let avatarUrl = "";
      if (avatarFile) {
        avatarUrl = await uploadToImageBB(avatarFile);
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
        password: formData.password,
        avatar: avatarUrl,
      };

      const res = await register(userData);
      if (!res.success) {
        setError(res.error || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-12">
      <div className="card w-full max-w-2xl bg-white border border-gray-100 shadow-xl">
        <div className="card-body text-left">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 bg-[#e11d48] rounded-full flex items-center justify-center shadow-lg mb-2">
              <Droplet className="text-white w-8 h-8" />
            </div>
            <h2 className="card-title text-2xl font-bold text-gray-900">Join as a Donor</h2>
            <p className="text-sm text-gray-500">Create your account to save lives</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Full Name</span></label>
                <input type="text" name="name" placeholder="John Doe" className="input input-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Email</span></label>
                <input type="email" name="email" placeholder="you@example.com" className="input input-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Blood Group</span></label>
                <select name="bloodGroup" className="select select-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]" value={formData.bloodGroup} onChange={handleChange} required>
                  <option value="" disabled>Select Blood Group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Avatar</span></label>
                <input type="file" accept="image/*" className="file-input file-input-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]" onChange={(e) => setAvatarFile(e.target.files[0])} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">District</span></label>
                <select name="district" className="select select-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]" value={formData.district} onChange={handleDistrictChange} required>
                  <option value="" disabled>Select District</option>
                  {districts.map((d) => (
                    <option key={d.id || d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Upazila</span></label>
                <select name="upazila" className="select select-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]" value={formData.upazila} onChange={handleChange} required disabled={!formData.district}>
                  <option value="" disabled>Select Upazila</option>
                  {upazilas.map((u) => (
                    <option key={u.id || u.name} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Password</span></label>
                <input type="password" name="password" placeholder="••••••••" className="input input-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Confirm Password</span></label>
                <input type="password" name="confirmPassword" placeholder="••••••••" className="input input-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            {error && (
              <div className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn bg-[#e11d48] hover:bg-[#be123c] border-none text-white w-full mt-4`}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#e11d48] font-bold hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
