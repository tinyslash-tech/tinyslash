import React from 'react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import LinkCheckerCard from '../components/LinkCheckerCard';
import { Helmet } from 'react-helmet-async';

const LinkCheckerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Link Checker - Verify URL Safety | TinySlash</title>
        <meta name="description" content="Check if a link is safe before clicking. TinySlash Link Checker analyzes URLs for security threats, malware, and phishing attempts." />
      </Helmet>

      <PublicHeader />

      <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Link Safety Checker</h1>
            <p className="text-xl text-gray-600 max-w-xl mx-auto">
              Worried about a suspicious link? Scan it instantly with our advanced security engine to detect malware, phishing, and safety threats.
            </p>
          </div>

          <div className="flex justify-center">
            <LinkCheckerCard />
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Scanning</h3>
              <p className="text-sm">We analyze links in real-time against multiple threat intelligence databases.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Phishing Detection</h3>
              <p className="text-sm">Identify deceptive sites trying to steal your credentials or personal data.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Malware Protection</h3>
              <p className="text-sm">Prevent drive-by downloads and malicious software infections.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LinkCheckerPage;
