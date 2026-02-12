
import React from 'react';
import { Star, UserCircle } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900">Loved by thousands of users</h2>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Join 50,000+ marketers, creators, and developers who trust TinySlash.
        </p>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="flex animate-marquee gap-8 py-4 items-stretch whitespace-nowrap">
          {[...Array(2)].map((_, setIndex) => (
            <React.Fragment key={setIndex}>
              {[
                {
                  quote: "TinySlash has completely changed how we track our marketing campaigns. The analytics are superb.",
                  author: "Ravi Kumar",
                  role: "Digital Marketer, Hyderabad"
                },
                {
                  quote: "The cleanest URL shortener I've used. No ads, just features. Best for my startup.",
                  author: "Anusha Reddy",
                  role: "Tech Lead, Bangalore"
                },
                {
                  quote: "Custom domains and QR codes saved us so much time. Highly recommend for local businesses.",
                  author: "Karthik Raju",
                  role: "Business Owner, Vijayawada"
                },
                {
                  quote: "File sharing feature is something I didn't know I needed. Great for sharing documents.",
                  author: "Manoj Krishna",
                  role: "Consultant, Visakhapatnam"
                },
                {
                  quote: "Analytics are real-time and incredibly detailed. Helps in understanding customer behavior.",
                  author: "Swathi Chaudhry",
                  role: "Growth Manager, Chennai"
                }
              ].map((t, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className="w-[400px] flex-shrink-0 p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 mx-4 whitespace-normal"
                >
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 mb-8 font-medium text-lg leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <UserCircle size={32} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{t.author}</div>
                      <div className="text-sm text-gray-500 font-medium">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
    </section>
  );
};

export default Testimonials;
