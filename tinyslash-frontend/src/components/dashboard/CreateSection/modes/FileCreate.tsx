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

  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file type if needed, matching the input accept attribute
      const validTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      // Basic validation or just accept it (input accept is verified by browser, but drop needs manual check if strict)
      // For now, let's accept it to match the "any file" behavior unless strict validation is required
      setSelectedFile(file);
    }
  };

  return (
    <div>
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
        Upload file to create shareable link
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className={`mb-2 ${isDragging ? 'text-blue-700' : 'text-gray-600'}`}>
          {selectedFile ? selectedFile.name : (isDragging ? 'Drop file here' : 'Click to upload or drag and drop')}
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
