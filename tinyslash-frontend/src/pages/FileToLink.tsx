import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileImage, Lock, Clock, Cloud, Share2, FileText, Download, ShieldCheck, Zap } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import AuthModal from '../components/AuthModal';

const BenefitCard = ({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color] || colorClasses.blue}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

const FileToLink: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleSignupPrompt = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="Secure File to Link Sharing | Upload & Share | TinySlash"
        description="Upload files and convert them into secure, shareable short links. Set expiration dates, password protection, and track downloads."
        keywords="file sharing, file to link, upload file, share pdf, secure file sharing, expired link, password protect file"
      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Secure File to Link <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Sharing Simplified
                </span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
                Easily convert PDFs, images, and documents into trackable short links.
                Share securely with password protection and self-destruct timers.
              </p>
              <button
                onClick={handleSignupPrompt}
                className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105 shadow-xl"
              >
                Upload File Now
              </button>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            <BenefitCard
              icon={Cloud}
              title="Instant Upload"
              description="Drag & drop any file to generate a shareable link instantly. Supports all common formats."
              color="orange"
            />
            <BenefitCard
              icon={Lock}
              title="Password Protection"
              description="Keep confidential files safe. Require a password to access your shared documents."
              color="red"
            />
            <BenefitCard
              icon={Clock}
              title="Expiration Dates"
              description="Set links to comply with data policies. Expire links after a set time or download count."
              color="purple"
            />
            <BenefitCard
              icon={Share2}
              title="Track Downloads"
              description="See exactly when and where your files are being accessed with detailed analytics."
              color="blue"
            />
          </div>

          <div className="bg-gray-50 rounded-3xl p-10 md:p-16 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">More than just file hosting</h2>
                <p className="text-gray-600 text-lg">
                  TinySlash isn't just a basic file host. We give you control over how your content is shared and viewed.
                </p>

                <ul className="space-y-4">
                  {[
                    { text: "Preview files directly in the browser before downloading", icon: FileText },
                    { text: "Fast, global CDN delivery for lightning-quick access", icon: Zap },
                    { text: "Automatic malware scanning to keep users safe", icon: ShieldCheck },
                    { text: "Custom branded download pages", icon: FileImage }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-gray-900">
                        <item.icon size={18} />
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                {/* Abstract file representation */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center text-red-500">
                      <FileText size={32} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">Project_Proposal_v3.pdf</div>
                      <div className="text-sm text-gray-500">2.4 MB • Uploaded 2 mins ago</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="text-blue-600 font-mono text-sm bg-white px-3 py-1 rounded border border-gray-200">
                      tinyslash.com/f/k92Xm
                    </span>
                    <button className="text-gray-500 hover:text-gray-900 transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default FileToLink;
