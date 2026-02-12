
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LandingPageShortener from '../../../components/LandingPageShortener';

interface HeroProps {
  onSignupClick: () => void;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Hero: React.FC<HeroProps> = ({ onSignupClick }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-30 mix-blend-multiply animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full blur-[100px] opacity-30 mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full blur-[100px] opacity-30 mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-[1.1]"
          >
            India's Best URL Shortener & <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Link Management Platform
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            The all-in-one link management platform for modern teams.
            Advanced analytics, custom domains, and QR codes—beautifully simple.
          </motion.p>

          <motion.div variants={fadeIn} className="mb-12">
            <LandingPageShortener onSignupPrompt={onSignupClick} />
          </motion.div>

          <motion.p variants={fadeIn} className="text-sm text-gray-400 font-medium">
            No credit card required · Free plan forever · Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
