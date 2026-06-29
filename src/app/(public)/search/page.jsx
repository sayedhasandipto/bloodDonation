"use client";

import { useState, useEffect } from "react";
import { getDistricts, getUpazilas } from "@/services/locations";
import { userService } from "@/services/api";
import { Search, MapPin, Droplet, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SearchPage() {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  
  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    upazila: ""
  });
  
  const [results, setResults] = useState([]);
  const [allDonors, setAllDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const dists = await getDistricts();
        setDistricts(dists);
        
        const { data } = await userService.getPublicDonors();
        setAllDonors(data || []);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const filteredDonors = allDonors.filter(donor => {
      let match = true;
      if (formData.bloodGroup && donor.bloodGroup !== formData.bloodGroup) match = false;
      if (formData.district && donor.district !== formData.district) match = false;
      if (formData.upazila && donor.upazila !== formData.upazila) match = false;
      return match;
    });
    setResults(filteredDonors);
  }, [formData, allDonors]);

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



  const downloadPDF = () => {
    const input = document.getElementById("search-results-table");
    if (!input) return;
    
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("blood-donors-search-results.pdf");
    });
  };

  return (
    <div className="bg-base-200 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Donors</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find registered blood donors in your area. Use the filters below to find exactly what you need.
          </p>
        </div>

        {/* Search Form */}
        <div className="card bg-base-100 shadow-md mb-12">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              
              <div className="form-control">
                <label className="label"><span className="label-text text-gray-700 font-medium">Blood Group</span></label>
                <select className="select select-bordered w-full text-gray-800" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                  <option value="">All Groups</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text text-gray-700 font-medium">District</span></label>
                <select className="select select-bordered w-full text-gray-800" value={formData.district} onChange={handleDistrictChange}>
                  <option value="">All Districts</option>
                  {districts.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text text-gray-700 font-medium">Upazila</span></label>
                <select className="select select-bordered w-full text-gray-800" value={formData.upazila} onChange={(e) => setFormData({...formData, upazila: e.target.value})} disabled={!formData.district}>
                  <option value="">All Upazilas</option>
                  {upazilas.map((u) => (
                    <option key={u.name} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {!loading && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-2xl">
                  Found Donors: {results.length}
                </h2>
                {results.length > 0 && (
                  <button onClick={downloadPDF} className="btn btn-outline btn-error btn-sm">
                    <Download className="w-4 h-4 mr-2" /> Export to PDF
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="text-center py-16 bg-base-200 rounded-xl border border-dashed border-base-300">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold">No Donors Found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div id="search-results-table" className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Donor</th>
                        <th>Blood Group</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((donor) => (
                        <tr key={donor._id} className="hover">
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="mask mask-squircle w-12 h-12">
                                  <img src={donor.avatar || "https://i.ibb.co/CpDtbhR/default-avatar.png"} alt={donor.name} />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">{donor.name}</div>
                                <div className="text-sm opacity-50">{donor.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-crimson-100 text-crimson-700 border-none font-bold gap-1">
                              <Droplet className="w-3 h-3 fill-crimson-700" />
                              {donor.bloodGroup}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                              {donor.upazila}, {donor.district}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${donor.status === "active" ? "badge-success" : "badge-error"} text-white`}>
                              {donor.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
