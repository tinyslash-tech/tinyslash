import React, { useState } from 'react';
import { X, Wand2, Sparkles, Loader2 } from 'lucide-react';
import { generateAIPage, AIGenerateRequest, AIGenerateResponse } from '../../services/api';
import toast from 'react-hot-toast';

interface AiGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: AIGenerateResponse) => void;
  // Passing user plan logic from parent or fetching here. We assume parent handles gatekeeping or we rely on backend.
}

const CATEGORIES = [
  'CREATOR_LIFESTYLE', 'CREATOR_BEAUTY', 'CREATOR_GAMING', 'CREATOR_TECH',
  'CREATOR_FITNESS', 'CREATOR_TRAVEL', 'CREATOR_FOOD', 'CREATOR_FASHION',
  'BUSINESS_AGENCY', 'BUSINESS_SAAS', 'BUSINESS_ECOMMERCE', 'BUSINESS_RESTAURANT',
  'BUSINESS_REALESTATE', 'BUSINESS_FITNESS', 'BUSINESS_SALON', 'BUSINESS_CONSULTING',
  'PORTFOLIO_DESIGNER', 'PORTFOLIO_DEVELOPER', 'PORTFOLIO_PHOTOGRAPHER',
  'PORTFOLIO_WRITER', 'PORTFOLIO_MARKETER', 'PORTFOLIO_ARTIST', 'PORTFOLIO_SPEAKER',
  'PORTFOLIO_COACH'
];

export const AiGenerationModal: React.FC<AiGenerationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [category, setCategory] = useState<string>('CREATOR_LIFESTYLE');
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your page');
      return;
    }

    if (prompt.length > 500) {
      toast.error('Prompt is too long (max 500 characters)');
      return;
    }

    setIsLoading(true);
    try {
      const requestData: AIGenerateRequest = { category, prompt };
      const responseData = await generateAIPage(requestData);
      toast.success('AI Page generated successfully!');
      onSuccess(responseData);
      onClose();
    } catch (error: any) {
      if (error.response?.status === 402 || error.response?.status === 403) {
        toast.error(error.response?.data || 'Failed to generate page. Please check your plan limits.');
      } else {
        toast.error('Failed to generate page. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {!isLoading && (
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Generate with AI</h2>
                <p className="text-sm text-gray-500 mt-1">Let AI build your perfect page instantly.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 sm:p-12 space-y-6 flex flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center relative z-10 shadow-xl shadow-blue-500/30">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Designing Your Page</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Our AI is writing your copy, selecting a beautiful theme, and arranging the layout...
              </p>
            </div>

            <div className="w-full max-w-xs bg-gray-100 rounded-full h-1.5 mt-8 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full w-full animate-[progress_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Category Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Page Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
              >
                <option disabled>Creators</option>
                {CATEGORIES.filter(c => c.startsWith('CREATOR')).map(c => (
                  <option key={c} value={c}>{c.replace('CREATOR_', '').replace(/_/g, ' ')}</option>
                ))}
                <option disabled>---</option>
                <option disabled>Business</option>
                {CATEGORIES.filter(c => c.startsWith('BUSINESS')).map(c => (
                  <option key={c} value={c}>{c.replace('BUSINESS_', '').replace(/_/g, ' ')}</option>
                ))}
                <option disabled>---</option>
                <option disabled>Portfolio</option>
                {CATEGORIES.filter(c => c.startsWith('PORTFOLIO')).map(c => (
                  <option key={c} value={c}>{c.replace('PORTFOLIO_', '').replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Describe Your Page</label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                  placeholder="E.g., I am a fitness coach in New York City offering custom workout plans and 1-on-1 coaching online."
                  className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none disabled:opacity-50"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {prompt.length}/500
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
            <p className="text-xs text-gray-500 flex-1">
              Uses <span className="font-semibold text-gray-700">1 AI Generation Credit</span>
            </p>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || prompt.length === 0 || prompt.length > 500}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
