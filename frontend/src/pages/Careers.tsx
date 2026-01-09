import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Zap, Users, Code, ChevronDown, ChevronRight, Briefcase, MapPin, Clock } from 'lucide-react';
import { careerApi, Job } from '../api/careerApi';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await careerApi.getAllJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-medium text-sm mb-6 border border-blue-500/30">
            We are hiring! 🚀
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Build the Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              Link Management
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join TinySlash and help teams worldwide manage links, branding, and analytics at scale.
          </p>
          <div className="flex justify-center">
            <a
              href="#open-positions"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 group"
            >
              View Open Roles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Why Work at TinySlash */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why TinySlash?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're building more than just a tool. We're building a culture of ownership, speed, and innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <BenefitCard
              icon={<Zap className="w-6 h-6 text-yellow-500" />}
              title="Scale & Impact"
              description="Work on high-performance systems serving millions of requests. Your code runs the show."
            />
            <BenefitCard
              icon={<Globe className="w-6 h-6 text-blue-500" />}
              title="Remote-First"
              description="Work from anywhere. We care about output, not hours or location."
            />
            <BenefitCard
              icon={<Users className="w-6 h-6 text-purple-500" />}
              title="Ownership"
              description="No micromanagement. You own your features from design to deployment."
            />
            <BenefitCard
              icon={<Code className="w-6 h-6 text-green-500" />}
              title="Modern Stack"
              description="We use the latest tech: React, Node.js, Next.js, and serverless infrastructure."
            />
            <BenefitCard
              icon={<Briefcase className="w-6 h-6 text-red-500" />}
              title="Competitive Pay"
              description="Top-tier salary packages, equity options, and comprehensive benefits."
            />
            <BenefitCard
              icon={<Users className="w-6 h-6 text-orange-500" />}
              title="Great Culture"
              description="Collaborative environment with regular team retreats and learning opportunities."
            />
          </div>
        </div>
      </section>

      {/* 3. Open Positions */}
      <section id="open-positions" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Open Positions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our mission to build the best link management platform.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading open roles...</p>
            </div>
          ) : (
            <>
              {(() => {
                const fullTimeJobs = jobs.filter(j => j.type !== 'Internship');
                const internshipJobs = jobs.filter(j => j.type === 'Internship');

                return (
                  <>
                    <div className="mb-20">
                      <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                        Full-time Opportunities
                      </h3>
                      {fullTimeJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {fullTimeJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300">
                          No full-time roles open at the moment.
                        </div>
                      )}
                    </div>

                    <div id="internships" className="scroll-mt-24">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                              Student & Internship Program
                            </h3>
                            <p className="text-gray-600 max-w-xl">
                              Launch your career with real-world impact. Our internships are designed to help you learn, grow, and ship code to production.
                            </p>
                          </div>
                          <div className="hidden md:block">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm border border-indigo-100">
                              <Zap className="w-3 h-3" /> Summer 2026 Batch
                            </span>
                          </div>
                        </div>

                        {internshipJobs.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {internshipJobs.map((job) => (
                              <JobCard key={job.id} job={job} isInternship />
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 bg-white/50 p-6 rounded-xl border border-dashed border-indigo-200">
                            No internship roles open at the moment.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );

              })()}
            </>
          )}

          <div className="mt-16 text-center">
            <p className="text-gray-500">
              Don't see your role? <a href="mailto:careers@tinyslash.com" className="text-blue-600 font-medium hover:underline">Email us your resume</a>
            </p>
          </div>
        </div>
      </section >

      {/* 4. Hiring Process */}
      < section className="py-24 bg-slate-50 border-t border-slate-200" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How We Hire</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent, fast, and respectful of your time.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ProcessStep
                number="1"
                title="Apply Online"
                description="Submit your application with your resume and portfolio."
              />
              <ProcessStep
                number="2"
                title="Screening Call"
                description="A quick chat to get to know each other and discuss fit."
              />
              <ProcessStep
                number="3"
                title="Skill Assessment"
                description="A practical task or technical interview to verify skills."
              />
              <ProcessStep
                number="4"
                title="Offer & Onboarding"
                description="Welcome to the team! We'll set you up for success."
              />
            </div>
          </div>
        </div>
      </section >

      {/* 5. FAQ */}
      < section className="py-24 bg-white" >
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <AccordionItem
              question="Is this a remote position?"
              answer="Yes! We are a remote-first company with team members distributed globally."
            />
            <AccordionItem
              question="Do you hire freshers?"
              answer="Yes, we have roles for all experience levels, including internships for students and fresh graduates."
            />
            <AccordionItem
              question="What is the hiring timeline?"
              answer="We typically move from application to offer within 2-3 weeks, depending on the role and volume of applications."
            />
            <AccordionItem
              question="Can I apply for multiple roles?"
              answer="We recommend applying for the one role that best matches your skills and interests. If we see a fit for another role, we'll let you know."
            />
            <AccordionItem
              question="Are internships paid?"
              answer="Absolutely. All our internships are paid positions."
            />
          </div>
        </div>
      </section >

      {/* 6. CTA */}
      < section className="py-20 bg-slate-900 text-white text-center" >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Didn't find a role that fits?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We are always looking for talented individuals. Send your resume and we'll keep you in mind for future openings.
          </p>
          <a
            href="mailto:careers@tinyslash.com"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-lg border-b border-blue-400 pb-0.5 hover:border-blue-300 transition-colors"
          >
            Email us at careers@tinyslash.com <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section >

      <Footer />
    </div >
  );
};

// Sub-components
const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">
      {description}
    </p>
  </div>
);

const ProcessStep: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="bg-white md:bg-transparent p-6 md:p-0 rounded-xl shadow-sm md:shadow-none border md:border-none border-gray-100 text-center relative z-10">
    <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-50">
      {number}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);


const JobCard: React.FC<{ job: Job, isInternship?: boolean }> = ({ job, isInternship }) => (
  <div className={`group bg-white rounded-2xl border ${isInternship ? 'border-indigo-100 hover:border-indigo-300' : 'border-gray-200 hover:border-blue-200'} p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-start relative overflow-hidden`}>
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
      <Briefcase className={`w-24 h-24 ${isInternship ? 'text-indigo-600' : 'text-blue-600'} transform rotate-12`} />
    </div>

    <div className="flex items-center gap-3 mb-6">
      <span className={`px-3 py-1 rounded-full ${isInternship ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-blue-50 text-blue-700 border-blue-100'} text-xs font-semibold uppercase tracking-wider border`}>
        {job.department}
      </span>
      {/* Shorten ID for display if needed or show full */}
      <span className="text-xs font-mono text-gray-400" title={job.id}>Job ID</span>
    </div>

    <h3 className={`text-2xl font-bold text-slate-900 mb-3 ${isInternship ? 'group-hover:text-indigo-600' : 'group-hover:text-blue-600'} transition-colors`}>
      {job.title}
    </h3>

    <div className="flex flex-col gap-3 text-sm text-gray-500 mb-6 w-full">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-400" />
        {job.location}
      </div>
      <div className="flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-gray-400" />
        {job.type}
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        {job.experience}
      </div>
      {job.salary && (
        <div className="flex items-center gap-2 font-medium text-slate-700 mt-1">
          <span className="text-green-600">₹</span>
          {job.salary}
        </div>
      )}
    </div>

    <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
      {job.description}
    </p>

    <div className="mt-auto w-full pt-6 border-t border-gray-100 flex items-center justify-between">
      <span className="text-xs text-gray-400 font-medium">
        Posted {new Date(job.postedDate).toLocaleDateString()}
      </span>
      <Link
        to={`/careers/${job.id}`}
        className={`inline-flex items-center gap-2 ${isInternship ? 'text-indigo-600' : 'text-blue-600'} font-bold hover:gap-3 transition-all`}
      >
        View Role <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

const AccordionItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-slate-900">{question}</span>
        {isOpen ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="p-5 pt-0 bg-white text-gray-600 leading-relaxed border-t border-gray-100">
          <div className="pt-4">{answer}</div>
        </div>
      )}
    </div>
  );
};

export default Careers;
