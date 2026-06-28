import Link from "next/link";
import { Droplet, Heart, Globe, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-crimson-600 rounded-lg flex items-center justify-center">
              <Droplet className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Blood<span className="text-crimson-600">Connect</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            A user-friendly platform that facilitates blood donation activities, connecting generous donors with those in urgent need.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-crimson-600 transition-colors">
              <Globe className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-crimson-600 transition-colors">
              <MessageCircle className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-crimson-600 transition-colors">
              <Mail className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-crimson-400 transition-colors">Home</Link></li>
            <li><Link href="/search" className="hover:text-crimson-400 transition-colors">Search Donors</Link></li>
            <li><Link href="/donation-requests" className="hover:text-crimson-400 transition-colors">Blood Requests</Link></li>
            <li><Link href="/funding" className="hover:text-crimson-400 transition-colors">Funding</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-crimson-400 transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-crimson-400 transition-colors">FAQs</a></li>
            <li><a href="#" className="hover:text-crimson-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-crimson-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Subscribe</h3>
          <p className="text-sm text-gray-400 mb-4">Get updates on urgent blood needs in your area.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-crimson-600"
            />
            <button className="bg-crimson-600 text-white px-4 py-2 rounded-r-md hover:bg-crimson-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} BloodConnect. All rights reserved.
        </p>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-4 md:mt-0">
          Made with <Heart className="w-4 h-4 text-crimson-600 fill-crimson-600" /> to save lives.
        </p>
      </div>
    </footer>
  );
}
