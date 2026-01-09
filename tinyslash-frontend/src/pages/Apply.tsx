import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { jobs } from '../data/jobs'; // Keep for now if fallback needed, but ideally remove if not used or replace
import { careerApi } from '../api/careerApi';
import { ArrowLeft, CheckCircle, Upload, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Apply: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [job, setJob] = useState<any>(null); // Replace 'any' with Job interface if imported
  const [loadingJob, setLoadingJob] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resume: null as File | null,
    portfolio: '',
    linkedin: '',
    coverLetter: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (jobId) {
      setLoadingJob(true);
      careerApi.getJobById(jobId)
        .then(data => setJob(data))
        .catch(err => console.error("Failed to load job", err))
        .finally(() => setLoadingJob(false));
    }
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const applicationData = {
        jobId: job?.id || 'general', // Handle if no job selected?
        jobTitle: job?.title || 'General Application',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        portfolioUrl: formData.portfolio,
        linkedinUrl: formData.linkedin,
        // resume handled separately in API call
      };

      await careerApi.submitApplication(applicationData, formData.resume);

      console.log('Application submitted for:', job?.id);

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <PublicHeader />
        <div className="container mx-auto px-6 py-24 max-w-2xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Received!</h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Thanks for applying to the <span className="font-semibold text-slate-800">{job?.title || 'Team'}</span> role.
            We've sent a confirmation email to <span className="font-semibold text-slate-800">{formData.email}</span>.
          </p>
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-left mb-10">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="space-y-3 text-blue-800/80 text-sm">
              <li className="flex gap-2">
                <span className="font-bold">1. Review:</span> Our team will review your application within 2-3 days.
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2. Contact:</span> If selected, we'll reach out to schedule a screening call.
              </li>
            </ul>
          </div>
          <Link
            to="/careers"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <PublicHeader />

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link to={job ? `/careers/${job.id}` : "/careers"} className="inline-flex items-center text-gray-500 hover:text-slate-900 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to {job ? 'Job Details' : 'Careers'}
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-8 border-b border-gray-100 bg-slate-50/50">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {job ? `Apply for ${job.title}` : 'General Application'}
            </h1>
            <p className="text-gray-600">
              {job ? `${job.location} • ${job.type}` : 'Join our team'}
            </p>
            {job && (
              <div className="inline-block mt-4 px-3 py-1 bg-gray-200 text-gray-600 text-xs font-mono rounded">
                Job ID: {job.id}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">1</span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                  <input
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Links & Resume */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">2</span>
                Resume & Portfolio
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Resume/CV <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-8 text-center transition-colors bg-gray-50/50 hover:bg-blue-50/5">
                    <input
                      required
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-blue-600 font-medium hover:underline mb-1">
                        {formData.resume ? formData.resume.name : 'Click to upload'}
                      </span>
                      <span className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">LinkedIn Profile</label>
                    <input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      type="url"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Portfolio / GitHub</label>
                    <input
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      type="url"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Submit Application <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                By submitting this form, you agree to our <Link to="/privacy" className="underline hover:text-gray-800">Privacy Policy</Link>.
              </p>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Apply;
