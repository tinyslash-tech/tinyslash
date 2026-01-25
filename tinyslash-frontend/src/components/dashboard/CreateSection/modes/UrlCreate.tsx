import React from 'react';
import { AlertCircle } from 'lucide-react';
import { SecurityError } from '../ui/SecurityError';

interface UrlCreateProps {
  urlInput: string;
  setUrlInput: (value: string) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export const UrlCreate: React.FC<UrlCreateProps> = ({
  urlInput,
  setUrlInput,
  errorMessage,
  setErrorMessage
}) => {
  return (
    <div>
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
        Enter URL to shorten
      </label>
      <div className="relative">
        <input
          type="url"
          placeholder="https://example.com/very-long-url..."
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
            setErrorMessage(null);
          }}
          className={`w-full px-3 sm:px-4 py-3 sm:py-4 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
        />
      </div>
      <SecurityError message={errorMessage} />
    </div>
  );
};
