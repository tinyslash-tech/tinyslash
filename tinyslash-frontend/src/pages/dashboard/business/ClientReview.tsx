import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { approvePageDraft, rejectPageDraft, getPageDraftForReview, PageDraft } from '../../../services/api';
import { Preview } from '../../../components/page-builder/Preview';
import { LayoutDashboard, CheckCircle2, XCircle, ChevronLeft, Loader2, Monitor, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { ThreeDotsLoader } from '../../../components/ui/ThreeDotsLoader';

const ClientReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Fetch pending draft for review
  const { data: draft, isLoading, isError } = useQuery({
    queryKey: ['pageDraftReview', id],
    queryFn: () => getPageDraftForReview(id!),
    enabled: !!id,
    retry: false
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: () => approvePageDraft(id!),
    onSuccess: () => {
      toast.success('Changes approved successfully! Live page updated.');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Failed to approve changes');
      setIsSubmitting(false);
    }
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: () => rejectPageDraft(id!),
    onSuccess: () => {
      toast.success('Changes rejected.');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Failed to reject changes');
      setIsSubmitting(false);
    }
  });

  const handleApprove = () => {
    setIsSubmitting(true);
    approveMutation.mutate();
  };

  const handleReject = () => {
    setIsSubmitting(true);
    rejectMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ThreeDotsLoader size="lg" color="bg-indigo-600" />
      </div>
    );
  }

  if (isError || !draft) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Up to Date!</h2>
          <p className="text-gray-600 mb-6">There are no pending changes to review for this page right now.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10 shrink-0 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900">Review Changes</h1>
              <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider rounded-md border border-yellow-200">
                Pending Approval
              </span>
            </div>
            <p className="text-xs text-gray-500">/{draft.slug}</p>
          </div>
        </div>

        {/* Device Toggle */}
        <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${device === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${device === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReject}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 font-medium transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Reject Changes
          </button>

          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Approve & Publish
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex py-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Device Container */}
        <div className="w-full flex justify-center items-start px-4">
          <div className={`transition-all duration-300 ${device === 'mobile' ? 'w-[393px]' : 'w-full max-w-5xl'}`}>
            <div className="bg-white rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-gray-900/5 relative">
              {/* Virtual Device Frame (if mobile) */}
              {device === 'mobile' && (
                <>
                  <div className="absolute top-0 inset-x-0 h-6 flex justify-center mt-3 z-50 pointer-events-none">
                    <div className="w-24 h-6 bg-black rounded-b-xl"></div>
                  </div>
                  <div className="absolute -left-[5px] top-32 w-1 h-12 bg-gray-800 rounded-l-md"></div>
                  <div className="absolute -left-[5px] top-48 w-1 h-12 bg-gray-800 rounded-l-md"></div>
                  <div className="absolute -right-[5px] top-32 w-1 h-16 bg-gray-800 rounded-r-md"></div>
                </>
              )}

              {/* Secure Preview Embed */}
              <div
                className={`relative bg-white overflow-hidden ${device === 'mobile' ? 'rounded-[2rem] aspect-[9/19]' : 'rounded-2xl min-h-[800px]'
                  }`}
              >
                {/* Prevent interactions on the preview */}
                <div className="absolute inset-0 z-10 pointer-events-auto"></div>
                <div className="h-full w-full pointer-events-none select-none overflow-y-auto">
                  <Preview page={draft} mode="MOBILE" />
                </div>
              </div>
            </div>

            {/* Subtext info */}
            <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              Reviewing draft data. These changes are not yet visible to the public.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientReview;
