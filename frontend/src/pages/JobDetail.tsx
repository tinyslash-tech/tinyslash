import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Briefcase, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import { careerApi, Job } from '../api/careerApi';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!jobId) return;
        const data = await careerApi.getAllJobs();
        const foundJob = data.find(j => j.id === jobId);
        if (foundJob) {
          setJob(foundJob);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch job', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return <Navigate to="/careers" replace />;
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <PublicHeader />

      <div className="bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-12 md:py-20 max-w-5xl">
          <Link to="/careers" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200 uppercase tracking-wide">
                  {job.department}
                </span>
                <span className="text-gray-400 font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                  {job.id}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">{job.title}</h1>

              <div className="flex flex-wrap gap-4 md:gap-8 text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  {job.type}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  {job.experience}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    {job.salary}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 mt-6 md:mt-0">
              <Link
                to={`/careers/apply?jobId=${job.id}`}
                className="inline-flex justify-center items-center w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1"
              >
                Apply Now <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About the Role</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {job.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Responsibilities</h2>
              <ul className="space-y-4">
                {job.responsibilities && job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Requirements</h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 uppercase tracking-wide text-xs">Must Have</h3>
                <ul className="space-y-3">
                  {job.requirements?.mustHave && job.requirements.mustHave.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {job.requirements?.niceToHave && job.requirements.niceToHave.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 uppercase tracking-wide text-xs">Nice to Have</h3>
                  <ul className="space-y-3">
                    {job.requirements.niceToHave.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-600 text-lg leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 sticky top-32">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Benefits & Perks</h3>
              <ul className="space-y-4">
                {job.benefits && job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-500">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-sm mb-6">
                  Interested in this role? We'd love to hear from you.
                </p>
                <Link
                  to={`/careers/apply?jobId=${job.id}`}
                  className="block w-full text-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetail;
