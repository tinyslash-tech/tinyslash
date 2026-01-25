import React from 'react';
import { AlertCircle } from 'lucide-react';
import { SecurityError } from '../ui/SecurityError';

interface QrCreateProps {
  qrText: string;
  setQrText: (value: string) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  isEditMode: boolean;
}

export const QrCreate: React.FC<QrCreateProps> = ({
  qrText,
  setQrText,
  errorMessage,
  setErrorMessage,
  isEditMode
}) => {
  return (
    <div>
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
        Enter text or URL for QR code
      </label>
      <div className="relative">
        {isEditMode && (
          <div className="mb-2 text-sm text-blue-600 font-medium">
            ✏️ Editing existing QR code
          </div>
        )}
        <input
          type="text"
          placeholder={isEditMode ? "Editing QR code content..." : "Enter text, URL, or any content..."}
          value={qrText}
          onChange={(e) => {
            setQrText(e.target.value);
            setErrorMessage(null);
          }}
          className={`w-full px-3 sm:px-4 py-3 sm:py-4 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errorMessage
            ? 'border-red-500 bg-red-50'
            : isEditMode
              ? 'border-blue-300 bg-blue-50'
              : 'border-gray-300'
            }`}
        />
        <div className="absolute top-1/2 transform -translate-y-1/2 right-3 text-xs text-gray-500">
          {qrText.length}/2000
        </div>
      </div>
      <SecurityError message={errorMessage} />
      {qrText && !errorMessage && (
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${qrText.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-gray-600">
            {qrText.startsWith('http') ? 'URL detected' : 'Text content'}
          </span>
        </div>
      )}
    </div>
  );
};
