
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CTAProps {
  onSignupClick: () => void;
}

const CTA: React.FC<CTAProps> = ({ onSignupClick }) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px]"></div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to upgrade your links?</h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join the link management platform that puts you in control.
          Start for free, scale when you need to.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onSignupClick}
            className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors shadow-xl"
          >
            Get Started for Free
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="px-8 py-4 rounded-full text-lg font-bold text-white border border-white/20 hover:bg-white/10 transition-colors"
          >
            View Pricing
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
