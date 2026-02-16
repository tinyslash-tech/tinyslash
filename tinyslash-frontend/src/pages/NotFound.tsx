import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist."

      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative inline-block mb-8">
              <h1 className="text-[150px] font-black text-gray-100 leading-none select-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 bg-white px-4">Page Not Found</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Oops! We couldn't find that page.
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              The link you followed might be broken, or the page may have been moved.
              Don't worry, you can find your way back home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105"
              >
                <Home size={18} />
                Back to Home
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-8 py-3 rounded-full font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>

            <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Search size={18} className="text-blue-500" />
                Looking for something else?
              </h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <button onClick={() => navigate('/short-links')} className="hover:text-blue-600 underline">Short Links</button>
                <span className="text-gray-300">•</span>
                <button onClick={() => navigate('/qr-codes')} className="hover:text-blue-600 underline">QR Codes</button>
                <span className="text-gray-300">•</span>
                <button onClick={() => navigate('/file-to-link')} className="hover:text-blue-600 underline">File Sharing</button>
                <span className="text-gray-300">•</span>
                <button onClick={() => navigate('/contact')} className="hover:text-blue-600 underline">Contact Support</button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
