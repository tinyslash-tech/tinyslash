import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="Contact Us – TinySlash"
        description="Get in touch with the TinySlash team. We are here to help with your link management needs."
      />
      <PublicHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-lg text-gray-500">
              We'd love to hear from you. Please fill out this form or shoot us an email.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Email Us</h3>
                  <p className="text-gray-500 mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:support@tinyslash.com" className="text-blue-600 font-semibold text-lg hover:underline">support@tinyslash.com</a>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Office</h3>
                  <p className="text-gray-500 mb-2">Come say hello at our office headquarters.</p>
                  <address className="not-italic text-gray-900 font-medium">
                    Hyderabad, Telangana<br />
                    India
                  </address>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Phone</h3>
                  <p className="text-gray-500 mb-2">Mon-Fri from 8am to 5pm.</p>
                  <p className="text-gray-900 font-medium">+91 91829 28956</p>
                </div>
              </div>
            </div>

            <form className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" id="name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" id="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="you@company.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
