
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import TrustedCompanies from '../../components/TrustedCompanies';
import AuthModal from '../../components/AuthModal';
import { SEO } from '../../components/SEO';

// Sections
import Hero from './sections/Hero';
import HowItWorks from './sections/HowItWorks';
import TinySlashPages from './sections/TinySlashPages';
import ValueProposition from './sections/ValueProposition';
import Features from './sections/Features';
import Workflow from './sections/Workflow';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import CTA from './sections/CTA';

const LandingPage: React.FC = () => {
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
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 font-sans">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TinySlash",
          "url": "https://tinyslash.com"
        })}
      </script>
      <SEO
        title="TinySlash | Best URL Shortener & Branded Link Platform for India"
        description="Shorten, share, and track your links with TinySlash. The best TinyURL & Bitly alternative for custom branded links, dynamic QR codes, and secure trust badges. Start for free today!"
        keywords="URL shortener, link shortener, short URLs, custom URL shortener, branded links, link management platform, TinyURL alternative, Bitly alternative, QR code generator, dynamic QR codes, link analytics, click tracking, secure URL shortener India, free branded links for developers"
      />
      <PublicHeader />

      <Hero onSignupClick={handleSignupPrompt} />

      <TrustedCompanies />

      <HowItWorks />

      <TinySlashPages onSignupClick={handleSignupPrompt} />

      <ValueProposition />

      <Features />

      <Workflow />

      <Testimonials />

      <FAQ />

      <CTA onSignupClick={handleSignupPrompt} />

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

export default LandingPage;
