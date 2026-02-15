import React from 'react';
import { AlertCircle } from 'lucide-react';
import { SecurityError } from '../ui/SecurityError';

interface QrCreateProps {
  qrText: string;
  setQrText: (value: string) => void;
  campaignName: string;
  setCampaignName: (value: string) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  isEditMode: boolean;
  qrType: "static" | "dynamic";
  setQrType: (value: "static" | "dynamic") => void;
}

export const QrCreate: React.FC<QrCreateProps> = ({
  qrText,
  setQrText,
  campaignName,
  setCampaignName,
  errorMessage,
  setErrorMessage,
  isEditMode,
  qrType,
  setQrType
}) => {
  return (
    <div>
      <div className="mb-5">
        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
          Campaign Name <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Summer Sale 2024"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base mb-4"
        />

        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
          QR Code Type {isEditMode && <span className="text-xs font-normal text-gray-500 ml-2">(Cannot be changed while editing)</span>}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => !isEditMode && setQrType("dynamic")}
            disabled={isEditMode}
            className={`p-3 rounded-lg border-2 text-center transition-all ${qrType === "dynamic"
              ? "border-black bg-gray-50 text-black ring-1 ring-black opacity-100"
              : "border-gray-200 text-gray-600 bg-white opacity-50 cursor-not-allowed"}`}
          >
            <div className="font-semibold flex items-center justify-center gap-2">Dynamic</div>
            <div className="text-xs mt-1 text-gray-500">Update destination anytime</div>
          </button>
          <button
            onClick={() => !isEditMode && setQrType("static")}
            disabled={isEditMode}
            className={`p-3 rounded-lg border-2 text-center transition-all ${qrType === "static"
              ? "border-black bg-gray-50 text-black ring-1 ring-black opacity-100"
              : "border-gray-200 text-gray-600 bg-white opacity-50 cursor-not-allowed"}`}
          >
            <div className="font-semibold flex items-center justify-center gap-2">Static</div>
            <div className="text-xs mt-1 text-gray-500">Permanent, unchangeable</div>
          </button>
        </div>
      </div>

      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
        Enter text or URL for QR code
      </label>
      <div className="relative">
        {isEditMode && (
          <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-indigo-800">
            <div className="flex items-start">
              <span className="text-xl mr-2"></span>
              <div>
                <h4 className="font-semibold mb-1">Dynamic QR Code</h4>
                <p className="text-indigo-700 leading-relaxed">
                  This QR code is <strong>dynamic</strong>. Updating the destination will <strong>instantly apply</strong> to all existing QR prints. You do not need to reprint or redistribute.
                </p>
              </div>
            </div>
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
