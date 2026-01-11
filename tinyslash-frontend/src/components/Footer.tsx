import React from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Linkedin, Instagram, Youtube, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">

          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img src="/logo.png" alt="Tinyslash Logo" className="w-10 h-10 object-contain mr-2" />
              <span className="text-2xl font-bold">
                <span className="text-white">Tiny</span>
                <span className="text-[#36a1ce]">Slash</span>
              </span>
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              The smartest URL shortener for modern businesses. Create, manage, and track your links with powerful analytics.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <span className="text-white font-medium">hello@tinyslash.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-white font-medium">Hyderabad, Telangana</span>
              </div>
              <div className="flex gap-4 pt-2">
                <a href="https://www.linkedin.com/company/tinyslash/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={24} />
                </a>
                <a href="https://www.instagram.com/tinyslash.com2025/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="https://www.youtube.com/@tinyslash-2025" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube size={24} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="https://x.com/Tinyslash2025" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Features</h3>
            <ul className="space-y-4">
              <li><Link to="/short-links" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Short Links</Link></li>
              <li><Link to="/qr-codes" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">QR Codes</Link></li>
              <li><Link to="/file-to-link" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">File to Link</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Solutions</h3>
            <ul className="space-y-4">
              <li><Link to="/solutions/social-media" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Social Media</Link></li>
              <li><Link to="/solutions/digital-marketing" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Digital Marketing</Link></li>
              <li><Link to="/solutions/customer-support" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Customer Support</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          {/* Company */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Pricing</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Careers</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Contact</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Legal & Policies</h3>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Terms & Conditions</Link></li>
              <li><Link to="/cancellation-refund" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium block">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-lg mb-4 md:mb-0">
              © 2025 <span className="text-white font-semibold">TinySlash</span>. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg"
              >
                Terms
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;