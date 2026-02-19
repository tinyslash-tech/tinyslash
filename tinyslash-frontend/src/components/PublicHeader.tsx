import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Link2, QrCode, FileText, Layout, Share2, BarChart3, MessageSquare, FolderOpen, ChevronDown } from 'lucide-react';
import AuthModal from './AuthModal';
import LinkCheckModal from './LinkCheckModal';

interface NavDropdownItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  colorClass?: string;
}

const NavDropdownItem: React.FC<NavDropdownItemProps> = ({ icon: Icon, title, description, onClick, colorClass = "text-blue-600" }) => (
  <button
    onClick={onClick}
    className="group flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 w-full text-left"
  >
    <div className={`p-2.5 rounded-lg bg-gray-50 group-hover:bg-white group-hover:shadow-md transition-all duration-200 ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h4>
      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
        {description}
      </p>
    </div>
  </button>
);

const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLinkCheckModalOpen, setIsLinkCheckModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
              onClick={() => {
                if (location.pathname !== '/') navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img src="/logo.webp" alt="Tinyslash Logo" className="w-10 h-10 object-contain" width="40" height="40" />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-gray-900">Tiny</span>
                <span className="text-blue-600">Slash</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex flex-1 justify-center items-center space-x-8">

              {/* Platforms Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-4"
                  onClick={(e) => { e.preventDefault(); }}
                >
                  Platforms
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[520px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <NavDropdownItem
                        icon={Link2}
                        title="Short Links"
                        description="Create branded short links in seconds."
                        onClick={() => navigate('/short-links')}
                      />
                      <NavDropdownItem
                        icon={QrCode}
                        title="QR Codes"
                        description="Generate custom QR codes for your business."
                        onClick={() => navigate('/qr-codes')}
                        colorClass="text-purple-600"
                      />
                      <NavDropdownItem
                        icon={FileText}
                        title="File to Link"
                        description="Convert files into shareable links."
                        onClick={() => navigate('/file-to-link')}
                        colorClass="text-orange-600"
                      />
                      <NavDropdownItem
                        icon={Layout}
                        title="TinySlash Pages"
                        description="Build beautiful landing pages effortlessly."
                        onClick={() => navigate('/pages')}
                        colorClass="text-pink-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Solutions Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-4"
                  onClick={(e) => { e.preventDefault(); }}
                >
                  Solutions
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[520px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <NavDropdownItem
                        icon={Share2}
                        title="Social Media"
                        description="Boost engagement on social platforms."
                        onClick={() => navigate('/solutions/social-media')}
                        colorClass="text-indigo-600"
                      />
                      <NavDropdownItem
                        icon={BarChart3}
                        title="Digital Marketing"
                        description="Track and optimize your marketing campaigns."
                        onClick={() => navigate('/solutions/digital-marketing')}
                        colorClass="text-green-600"
                      />
                      <NavDropdownItem
                        icon={MessageSquare}
                        title="Customer Support"
                        description="Enhance support with smart links."
                        onClick={() => navigate('/solutions/customer-support')}
                        colorClass="text-teal-600"
                      />
                      <NavDropdownItem
                        icon={FolderOpen}
                        title="File Sharing"
                        description="Securely share files with your team."
                        onClick={() => navigate('/solutions/file-sharing')}
                        colorClass="text-cyan-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => navigate('/pricing')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Pricing</button>
              <button onClick={() => navigate('/blog')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Blog</button>

              <button
                onClick={() => setIsLinkCheckModalOpen(true)}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Check your Link
              </button>

            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
                className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600 hover:text-gray-900">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="space-y-1 pl-4 border-l-2 border-gray-100 ml-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Platforms</p>
                  <button onClick={() => { navigate('/short-links'); setIsMenuOpen(false); }} className="block text-sm font-medium text-gray-500 py-1 w-full text-left hover:text-blue-600">Short Links</button>
                  <button onClick={() => { navigate('/qr-codes'); setIsMenuOpen(false); }} className="block text-sm font-medium text-gray-500 py-1 w-full text-left hover:text-blue-600">QR Codes</button>
                  <button onClick={() => { navigate('/file-to-link'); setIsMenuOpen(false); }} className="block text-sm font-medium text-gray-500 py-1 w-full text-left hover:text-blue-600">File to Link</button>
                  <button onClick={() => { navigate('/pages'); setIsMenuOpen(false); }} className="block text-sm font-medium text-gray-500 py-1 w-full text-left hover:text-blue-600">TinySlash Pages</button>
                </div>

                <div className="space-y-1 pl-4 border-l-2 border-gray-100 ml-1 pt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Solutions</p>
                  <button onClick={() => { navigate('/solutions/social-media'); setIsMenuOpen(false); }} className="block text-sm font-medium text-gray-500 py-1 w-full text-left hover:text-blue-600">Social Media</button>
                  <button onClick={() => { navigate('/solutions/digital-marketing'); setIsMenuOpen(false); }} className="block text-sm font-medium text-gray-500 py-1 w-full text-left hover:text-blue-600">Digital Marketing</button>
                  <button onClick={() => { navigate('/solutions/customer-support'); setIsMenuOpen(false); }} className="block text-sm font-medium text-gray-500 py-1 w-full text-left hover:text-blue-600">Customer Support</button>
                  <button onClick={() => { navigate('/solutions/file-sharing'); setIsMenuOpen(false); }} className="block text-sm font-medium text-gray-500 py-1 w-full text-left hover:text-blue-600">File Sharing</button>
                </div>

                <button onClick={() => { navigate('/pricing'); setIsMenuOpen(false); }} className="block text-base font-medium text-gray-600 w-full text-left hover:text-blue-600">Pricing</button>
                <button onClick={() => { navigate('/blog'); setIsMenuOpen(false); }} className="block text-base font-medium text-gray-600 w-full text-left hover:text-blue-600">Blog</button>
                <button
                  onClick={() => { setIsLinkCheckModalOpen(true); setIsMenuOpen(false); }}
                  className="block text-base font-medium text-gray-600 w-full text-left hover:text-blue-600"
                >
                  Check your Link
                </button>


                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <button
                    onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                    className="block w-full text-center py-2.5 text-gray-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                    className="block w-full text-center py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    Sign up free
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Link Check Modal */}
      <LinkCheckModal
        isOpen={isLinkCheckModalOpen}
        onClose={() => setIsLinkCheckModalOpen(false)}
      />
    </>
  );
};

export default PublicHeader;
