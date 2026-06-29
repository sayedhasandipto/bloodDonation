"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, Users, Activity, Phone, Mail, MapPin, Calendar, Clock, ArrowRight, Droplet, Eye, DollarSign, ChevronDown } from "lucide-react";
import { donationService } from "@/services/api";

const faqs = [
  {
    question: "Who can donate blood?",
    answer: "Most people can donate blood if they are in good health, weigh at least 50kg, and are aged between 18 and 65."
  },
  {
    question: "How often can I donate blood?",
    answer: "Men can safely give blood every 12 weeks, and women can give blood every 16 weeks."
  },
  {
    question: "Is the blood donation process safe?",
    answer: "Yes, it is entirely safe. A new, sterile needle is used for each donation and is immediately discarded afterwards. You cannot get any disease from donating blood."
  },
  {
    question: "How long does a blood donation take?",
    answer: "The actual blood donation typically takes about 8-10 minutes. The entire process, including registration, mini-physical, and refreshments, takes about 45-60 minutes."
  },
  {
    question: "What should I do before donating blood?",
    answer: "Drink plenty of water, eat a healthy meal avoiding fatty foods, and make sure you get a good night's sleep before your donation."
  }
];

export default function HomePage() {
  const [featuredRequests, setFeaturedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await donationService.getPendingRequests();
        setFeaturedRequests(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative w-full min-h-[500px] flex items-center justify-center text-white pt-28 pb-32 md:pt-36 md:pb-44">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524721696987-b9527df9e512?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/40 to-gray-900/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 tracking-tight text-white leading-tight">
              Saving Lives, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-[#e11d48]">One Drop</span> at a Time
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto font-medium">
              Connect directly with 19 pending requests or join our community of donors to help save more lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="flex items-center justify-center gap-2 bg-[#f43f5e] hover:bg-[#e11d48] text-white font-bold py-3 px-8 rounded-xl transition-all">
                Become a Donor <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/search" className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all">
                Search Donors <Eye className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-gray-50 pb-20">
        {/* Stats Cards */}
        <div className="relative z-20 px-4 -mt-20 md:-mt-24 mb-20">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center text-center border border-gray-100"
              >
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-[#f43f5e]" />
                </div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-1">15+</h3>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Active Donors</p>
              </motion.div>
              
              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center text-center border border-gray-100"
              >
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5 text-[#f43f5e]" />
                </div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-1">$12,886</h3>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Total Funding</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center text-center border border-gray-100"
              >
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                  <Droplet className="w-5 h-5 text-[#f43f5e]" />
                </div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-1">19</h3>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Total Requests</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Featured Section - Recent Requests */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Urgent Blood Requests</h2>
            <div className="w-24 h-1 bg-[#e11d48] mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">These individuals are currently in critical need of blood. Your immediate response could save a life today.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-[#e11d48]"></span>
            </div>
          ) : featuredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRequests.map((req, idx) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#fff1f2] rounded-full flex items-center justify-center">
                          <Droplet className="w-6 h-6 text-[#e11d48] fill-[#e11d48]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Blood Group</p>
                          <p className="text-2xl font-bold text-[#e11d48]">{req.bloodGroup}</p>
                        </div>
                      </div>
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Urgent</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-800">{req.recipientUpazila}, {req.recipientDistrict}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>{new Date(req.donationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span>{req.donationTime}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/donation-requests/${req._id}`} className="block text-center py-3 w-full border border-[#e11d48] text-[#e11d48] font-bold rounded-xl hover:bg-[#e11d48] hover:text-white transition-colors group">
                    View Details <ArrowRight className="inline w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
              <Droplet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700">No Urgent Requests Right Now</h3>
              <p className="text-gray-500 mt-2">Check back later or join our donor network.</p>
            </div>
          )}

          {featuredRequests.length > 0 && (
            <div className="text-center mt-10">
              <Link href="/donation-requests" className="btn bg-gray-900 hover:bg-gray-800 text-white border-none px-8 rounded-xl font-bold">
                View All Requests
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Section - How it works */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-[#e11d48] mx-auto mb-16 rounded-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: <Users className="w-12 h-12 text-[#e11d48]" />, title: "Register", desc: "Create an account in minutes and join our network of life-savers." },
              { icon: <Activity className="w-12 h-12 text-[#e11d48]" />, title: "Find Requests", desc: "Browse urgent blood requests in your local area easily." },
              { icon: <Heart className="w-12 h-12 text-[#e11d48]" />, title: "Save a Life", desc: "Donate blood to hospitals and individuals in critical need." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 bg-[#fff1f2] rounded-full flex items-center justify-center shadow-sm mb-6 mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-[#e11d48] mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-6 text-lg">Find answers to common questions about blood donation. If you have any other questions, feel free to contact us.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'shadow-md border-[#e11d48]/30' : 'hover:border-gray-300 hover:shadow-sm'}`}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-white"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <span className="font-semibold text-lg text-gray-900">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaqIndex === index ? 'bg-[#fff1f2] text-[#e11d48]' : 'bg-gray-50 text-gray-400'}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="w-24 h-1 bg-[#e11d48] mx-auto rounded-full"></div>
          </div>
          <div className="max-w-5xl mx-auto rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

            {/* Left: Contact Info */}
            <div className="md:w-5/12 bg-[#be123c] text-white p-10 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Get in Touch</h3>
              <p className="text-[#fecdd3] mb-8">Have questions about donation or need technical support? We&apos;re here to help.</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 mt-1 text-[#fda4af]" />
                  <div>
                    <p className="font-semibold text-lg text-white">+880 1234 567 890</p>
                    <p className="text-sm text-[#fda4af]">24/7 Support Line</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 mt-1 text-[#fda4af]" />
                  <div>
                    <p className="font-semibold text-lg text-white">support@bloodconnect.com</p>
                    <p className="text-sm text-[#fda4af]">Email us anytime</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 mt-1 text-[#fda4af]" />
                  <div>
                    <p className="font-semibold text-lg text-white">123 Health Ave, Dhaka</p>
                    <p className="text-sm text-[#fda4af]">Headquarters</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="md:w-7/12 bg-white p-10 md:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" placeholder="John" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48] focus:border-transparent bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" placeholder="Doe" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48] focus:border-transparent bg-white text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48] focus:border-transparent bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea placeholder="Write your message here..." rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48] focus:border-transparent bg-white text-gray-900 resize-none"></textarea>
                </div>
                <button type="button" className="w-full py-3 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-lg transition-colors">
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
