import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, Image, File, Music, Video, ExternalLink, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface FilePreviewData {
  fileCode: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  requiresPassword: boolean;
  isAuthorized: boolean;
  downloadUrl?: string; // Only present if authorized
  previewUrl?: string; // Public URL for preview if available
}

const FileViewer: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [fileData, setFileData] = useState<FilePreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8080/api');

  useEffect(() => {
    if (fileId) {
      fetchFilePreview();
    }
  }, [fileId]);

  const fetchFilePreview = async (pwd?: string) => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE}/v1/files/${fileId}/preview`;
      if (pwd) {
        url += `?password=${encodeURIComponent(pwd)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setFileData(data.data);
      } else {
        if (response.status === 404) {
          setError('File not found or expired');
        } else if (response.status === 401 || (data.data && data.data.requiresPassword && !data.data.isAuthorized)) {
          // If we got data but authorized=false, it means password required
          if (data.data) {
            setFileData(data.data); // Show locked UI
          } else {
            setError('Password required');
          }
        } else {
          setError(data.message || 'Failed to load file');
        }
      }
    } catch (err) {
      console.error('Error fetching file preview:', err);
      setError('Failed to load file preview');
    } finally {
      setLoading(false);
      setSubmittingPassword(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPassword(true);
    fetchFilePreview(password);
  };

  const handleDownload = async () => {
    if (!fileData || !fileData.downloadUrl) return;

    try {
      // 1. Trigger analytics
      // We use a separate beacon/fetch for analytics to ensure it counts even if download starts
      // Actually, since we have a dedicated download endpoint that redirects/streams, 
      // we can just open that URL and it handles analytics on the backend!
      // But we need to pass params if we want detailed analytics (ip, user agent is auto).

      // Ideally, the 'downloadUrl' from backend points to /api/v1/files/:code which does both.
      // Let's verify: FileController.downloadFile() calls fileUploadService.getFileContent()
      // accessing it directly via GET /api/v1/files/:code DOES NOT record analytics explicitly 
      // in the current controller code (it just streams).
      // The `handleFileRedirect` (POST /redirect) does record it.

      // Implementation Plan Update: 
      // We should use the explicit `recordDownload` endpoint OR update `downloadFile` GET to record (side-effect).
      // The easiest current way without changing GET is to call the record endpoint first.

      // 1. Trigger analytics
      // Analytics are now handled by the backend GET endpoint directly
      // This ensures that direct downloads and preview downloads are both counted reliably.

      // 2. Trigger Download
      // Create a temporary link to force download
      const link = document.createElement('a');
      link.href = fileData.downloadUrl;
      // We might need to append password if it's a direct stream download and session isn't cookie-based? 
      // The downloadUrl typically needs auth or token. 
      // If it's public (after password check), we might need a temporary token or re-send password?
      // For now, let's assume the downloadUrl provided by backend is valid or we append password.
      if (password) {
        link.href += `?password=${encodeURIComponent(password)}`;
      }

      link.download = fileData.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started');

    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to start download');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-green-600" />;
    if (type.startsWith('audio/')) return <Music className="w-8 h-8 text-pink-600" />;
    if (type.startsWith('video/')) return <Video className="w-8 h-8 text-purple-600" />;
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-600" />;
    return <File className="w-8 h-8 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Password Wall
  if (fileData && fileData.requiresPassword && !fileData.isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Password Protected</h2>
          <p className="text-gray-500 mb-6">This file is secured. Enter the password to view.</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              disabled={submittingPassword}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {submittingPassword ? 'Verifying...' : 'Unlock File'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error || !fileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">File Not Found</h2>
          <p className="text-gray-600">{error || 'The link may have expired or been removed.'}</p>
        </div>
      </div>
    );
  }

  // Determine Preview Content
  const renderPreview = () => {
    // If we have a direct preview URL (R2/S3 public), use that.
    // Otherwise fallback to downloadUrl (which might stream content).
    const src = fileData.previewUrl || fileData.downloadUrl;
    // Append password if needed for streaming
    const srcWithAuth = password ? `${src}?password=${encodeURIComponent(password)}` : src;

    // Google Docs Viewer URL
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(srcWithAuth || '')}&embedded=true`;

    if (fileData.fileType.startsWith('image/')) {
      return (
        <img src={srcWithAuth} alt={fileData.fileName} className="max-w-full h-auto max-h-[70vh] rounded-lg shadow-sm mx-auto" />
      );
    }

    if (fileData.fileType.startsWith('video/')) {
      return (
        <video controls className="w-full max-h-[70vh] rounded-lg shadow-sm bg-black">
          <source src={srcWithAuth} type={fileData.fileType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (fileData.fileType.startsWith('audio/')) {
      return (
        <div className="p-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-full shadow-sm mb-6">
            <Music className="w-12 h-12 text-pink-500" />
          </div>
          <audio controls className="w-full max-w-md">
            <source src={srcWithAuth} type={fileData.fileType} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    if (fileData.fileType === 'application/pdf') {
      return (
        <iframe
          src={srcWithAuth}
          className="w-full h-[80vh] rounded-lg border border-gray-200"
          title="PDF Preview"
        />
      );
    }

    // Office Docs via Google Viewer (Public URLs only normally, but let's try)
    // Note: Google Viewer needs the URL to be publicly accessible without auth headers. 
    // If it's a private backend stream, this won't work unless we have a public tokenized URL.
    // Assuming for now it works or falls back.
    if (fileData.fileType.includes('officedocument') || fileData.fileType.includes('msword') || fileData.fileType.includes('ms-excel') || fileData.fileType.includes('ms-powerpoint')) {
      return (
        <iframe
          src={googleDocsUrl}
          className="w-full h-[80vh] rounded-lg border border-gray-200"
          title="Document Preview"
        />
      );
    }

    // Default Fallback
    return (
      <div className="py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          {getFileIcon(fileData.fileType)}
        </div>
        <p className="text-gray-500 font-medium">Preview not available for this file type</p>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              {getFileIcon(fileData.fileType)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                {fileData.fileName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-900">{formatFileSize(fileData.fileSize)}</span>
                <span>•</span>
                <span>{new Date(fileData.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Download File</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {renderPreview()}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <Shield className="w-4 h-4" />
            <span>Shared via Tinyslash Secure Share</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default FileViewer;