import React from 'react';
import { Upload } from 'lucide-react';

interface FileCreateProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export const FileCreate: React.FC<FileCreateProps> = ({ selectedFile, setSelectedFile }) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div>
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
        Upload file to create shareable link
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">
          {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          PDF, Images, Documents (Max 10MB)
        </p>
        <input
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Choose File
        </label>
      </div>
    </div>
  );
};
