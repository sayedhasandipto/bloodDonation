"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { donationService } from "@/services/api";
import { getDistricts, getUpazilas } from "@/services/locations";
import { Edit, Activity, ArrowLeft, CheckCircle } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function EditDonationRequestPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  // Load districts
  useEffect(() => {
    const loadDistricts = async () => {
      const dists = await getDistricts();
      setDistricts(dists);
    };
    loadDistricts();
  }, []);

  // Fetch existing request data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setFetching(true);
        const { data } = await donationService.getRequestById(id);
        if (!data) {
          router.push("/dashboard/my-donation-requests");
          return;
        }
        setFormData({
          recipientName: data.recipientName || "",
          recipientDistrict: data.recipientDistrict || "",
          recipientUpazila: data.recipientUpazila || "",
          hospitalName: data.hospitalName || "",
          fullAddress: data.fullAddress || "",
          bloodGroup: data.bloodGroup || "",
          // Convert ISO date to YYYY-MM-DD for input[type=date]
          donationDate: data.donationDate ? data.donationDate.split("T")[0] : "",
          donationTime: data.donationTime || "",
          requestMessage: data.requestMessage || "",
        });
        // Load upazilas for the existing district
        if (data.recipientDistrict) {
          const ups = await getUpazilas(data.recipientDistrict);
          setUpazilas(ups);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load request details.");
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchRequest();
    }
  }, [id, user]);

  const handleDistrictChange = async (e) => {
    const districtValue = e.target.value;
    setFormData({ ...formData, recipientDistrict: districtValue, recipientUpazila: "" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await donationService.updateRequest(id, formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/my-donation-requests");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to update request.");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-[#e11d48] loading-lg"></span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">Request Updated!</h2>
        <p className="text-gray-500">Redirecting you back...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <button
          onClick={() => router.push("/dashboard/my-donation-requests")}
          className="btn btn-ghost btn-sm gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="w-12 h-12 bg-[#fff1f2] rounded-xl flex items-center justify-center">
          <Edit className="w-6 h-6 text-[#e11d48]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Donation Request</h1>
          <p className="text-gray-500">Update the details of this blood donation request.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {error && <div className="alert alert-error mb-6">{error}</div>}

        <div className="space-y-8">
          {/* Section 1: Patient Details */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#e11d48]" />
              Patient Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Recipient Name</span></label>
                <input
                  type="text"
                  name="recipientName"
                  className="input input-bordered w-full bg-white text-gray-900"
                  value={formData.recipientName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Required Blood Group</span></label>
                <select
                  name="bloodGroup"
                  className="select select-bordered w-full bg-white text-gray-900"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Blood Group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Location Details */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-t border-gray-100 pt-6">
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">District</span></label>
                <select
                  name="recipientDistrict"
                  className="select select-bordered w-full bg-white text-gray-900"
                  value={formData.recipientDistrict}
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
                  name="recipientUpazila"
                  className="select select-bordered w-full bg-white text-gray-900"
                  value={formData.recipientUpazila}
                  onChange={handleChange}
                  required
                  disabled={!formData.recipientDistrict}
                >
                  <option value="" disabled>Select Upazila</option>
                  {upazilas.map((u) => (
                    <option key={u.name} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Hospital Name</span></label>
                <input
                  type="text"
                  name="hospitalName"
                  className="input input-bordered w-full bg-white text-gray-900"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Full Address (Ward, Bed, etc)</span></label>
                <input
                  type="text"
                  name="fullAddress"
                  className="input input-bordered w-full bg-white text-gray-900"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 3: Time & Message */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-t border-gray-100 pt-6">
              Time & Message
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Donation Date</span></label>
                <input
                  type="date"
                  name="donationDate"
                  className="input input-bordered w-full bg-white text-gray-900"
                  value={formData.donationDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-gray-700">Donation Time</span></label>
                <input
                  type="time"
                  name="donationTime"
                  className="input input-bordered w-full bg-white text-gray-900"
                  value={formData.donationTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text font-medium text-gray-700">Request Message / Note</span></label>
                <textarea
                  name="requestMessage"
                  className="textarea textarea-bordered h-24 w-full bg-white text-gray-900"
                  placeholder="e.g. Urgent surgery, need 2 bags of blood..."
                  value={formData.requestMessage}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
          </section>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => router.push("/dashboard/my-donation-requests")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-[#e11d48] hover:bg-[#be123c] text-white border-none px-10"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
