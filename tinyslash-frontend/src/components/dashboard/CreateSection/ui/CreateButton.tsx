import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { CreateMode } from '../types';

interface CreateButtonProps {
  mode: CreateMode;
  isLoading: boolean;
  isEditMode: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const CreateButton: React.FC<CreateButtonProps> = ({
  mode,
  isLoading,
  isEditMode,
  onClick,
  disabled
}) => {
  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    if (isEditMode) return 'Update QR Code';
    switch (mode) {
      case 'url': return 'Shorten URL';
      case 'qr': return 'Generate QR Code';
      case 'file': return 'Generate URL';
    }
  };

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading || disabled}
        className={`w-full flex items-center justify-center space-x-2 py-3 sm:py-4 px-4 bg-black hover:bg-gray-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 active:scale-[0.98] ${(isLoading || disabled) ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
          }`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            {isEditMode ? <RefreshCw className="w-5 h-5" /> : (mode !== 'file' && <Sparkles className="w-5 h-5" />)}
            <span>{getButtonText()}</span>
          </>
        )}
      </button>
    </div>
  );
};
