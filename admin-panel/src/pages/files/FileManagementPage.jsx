import React, { useState } from 'react';

// File Management Page - Complete Implementation
const FileManagementPage = ({ hasPermission }) => {
  const [activeTab, setActiveTab] = useState('files');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  React.useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/v1/files/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const mappedFiles = result.files.map(file => ({
            id: file.id,
            fileCode: file.fileCode,
            fileName: file.fileName || 'Untitled',
            originalName: file.originalName,
            fileType: normalizeFileType(file.fileType),
            rawFileType: file.fileType,
            fileSize: formatFileSize(file.fileSize),
            fileSizeBytes: file.fileSize,
            owner: file.owner,
            ownerName: 'User', // Placeholder
            team: 'Personal', // Placeholder
            shortUrl: file.shortUrl,
            uploadDate: file.uploadDate ? new Date(file.uploadDate).toLocaleString() : 'N/A',
            lastAccessed: file.lastAccessed ? new Date(file.lastAccessed).toLocaleString() : 'Never',
            downloads: file.downloads || 0,
            uniqueDownloads: file.uniqueDownloads || 0,
            status: file.status || 'Active',
            expiryDate: file.expiryDate ? new Date(file.expiryDate).toLocaleDateString() : null,
            isPublic: file.isPublic,
            hasPassword: file.hasPassword,
            qrCode: false, // Not tracked in basic file model yet
            analytics: file.analytics || { countries: {}, devices: {} }
          }));
          setFiles(mappedFiles);
        } else {
          throw new Error(result.message || "Failed to fetch files");
        }
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const normalizeFileType = (mimeType) => {
    if (!mimeType) return 'File';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('video')) return 'Video';
    if (mimeType.includes('image')) return 'Image';
    if (mimeType.includes('excel') || mimeType.includes('sheet') || mimeType.includes('csv')) return 'Excel';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'Archive';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-800 border-red-200';
      case 'Video': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Document': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Excel': return 'bg-green-100 text-green-800 border-green-200';
      case 'Image': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Archive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return '📄';
      case 'Video': return '🎥';
      case 'Document': return '📝';
      case 'Excel': return '📊';
      case 'Image': return '🖼️';
      case 'Archive': return '📦';
      default: return '📁';
    }
  };

  // Storage analytics
  const storageStats = {
    totalFiles: files.length,
    totalSize: files.reduce((sum, file) => sum + file.fileSizeBytes, 0),
    totalDownloads: files.reduce((sum, file) => sum + file.downloads, 0),
    activeFiles: files.filter(f => f.status === 'Active').length,
    expiredFiles: files.filter(f => f.status === 'Expired').length,
    publicFiles: files.filter(f => f.isPublic).length,
    protectedFiles: files.filter(f => f.hasPassword).length,
    fileTypes: {
      PDF: files.filter(f => f.fileType === 'PDF').length,
      Video: files.filter(f => f.fileType === 'Video').length,
      Document: files.filter(f => f.fileType === 'Document').length,
      Excel: files.filter(f => f.fileType === 'Excel').length,
      Image: files.filter(f => f.fileType === 'Image').length,
      Archive: files.filter(f => f.fileType === 'Archive').length
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.ownerName && file.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (file.shortUrl && file.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'all' || file.fileType.toLowerCase() === filterType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">⚠️</div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Error loading files: {error}</p>
            <button
              onClick={fetchFiles}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
            >
              Click to retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">File Management</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Monitor file uploads, downloads, and storage usage.</p>
        </div>
      </div>

      {/* File Storage Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total Files</p>
              <h3 className="text-3xl font-bold mt-1">{storageStats.totalFiles}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">📁</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-100 text-xs">
            <span className="font-bold mr-1">{formatFileSize(storageStats.totalSize)}</span> total storage
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Downloads</p>
              <h3 className="text-3xl font-bold mt-1">{storageStats.totalDownloads.toLocaleString()}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">⬇️</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-emerald-100 text-xs">
            Lifetime downloads
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-violet-100 text-sm font-medium uppercase tracking-wider">Public Files</p>
              <h3 className="text-3xl font-bold mt-1">{storageStats.publicFiles}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">🌍</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-violet-100 text-xs">
            <span className="font-bold mr-1">{storageStats.protectedFiles}</span> password protected
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-amber-100 text-sm font-medium uppercase tracking-wider">Active Files</p>
              <h3 className="text-3xl font-bold mt-1">{storageStats.activeFiles}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-amber-100 text-xs">
            <span className="font-bold mr-1">{storageStats.expiredFiles}</span> expired
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Files</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search by filename, owner, or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="excel">Excel</option>
              <option value="image">Image</option>
              <option value="archive">Archive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size & Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center mr-4 border border-gray-100 dark:border-gray-600 shadow-sm">
                          <span className="text-2xl">{getFileTypeIcon(file.fileType)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5 truncate max-w-[200px]" title={file.fileName}>
                            {file.fileName}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-mono truncate max-w-[200px]">
                            {file.shortUrl}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Uploaded: {file.uploadDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 dark:text-white font-medium">{file.ownerName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{file.team}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{file.fileSize}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getFileTypeColor(file.fileType)}`}>
                          {file.fileType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                          <span className="mr-1.5 text-gray-400">⬇️</span>
                          {file.downloads.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last: {file.lastAccessed}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${file.status === 'Active'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${file.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {file.status}
                      </span>
                      {file.expiryDate && (
                        <div className="text-xs text-gray-400 mt-1">
                          Expires: {file.expiryDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border w-fit ${file.isPublic
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                          {file.isPublic ? '🌍 Public' : '🔒 Private'}
                        </span>
                        {file.hasPassword && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs bg-amber-50 text-amber-700 border border-amber-100 rounded-full w-fit">
                            🔑 Protected
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl mb-3">📂</span>
                      <p className="text-lg font-medium">No files found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Type Distribution</h3>
          <div className="space-y-3">
            {Object.entries(storageStats.fileTypes)
              .filter(([, count]) => count > 0)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getFileTypeIcon(type)}</span>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getFileTypeColor(type)}`}>
                      {type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{count} files</div>
                    <div className="text-xs text-gray-500">
                      {storageStats.totalFiles > 0 ? ((count / storageStats.totalFiles) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
              ))}
            {Object.values(storageStats.fileTypes).every(c => c === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No file data to display</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Downloaded Files</h3>
          <div className="space-y-3">
            {files
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 5)
              .map((file, index) => (
                <div key={file.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mr-3 text-sm">
                      {getFileTypeIcon(file.fileType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]" title={file.fileName}>
                        {file.fileName}
                      </div>
                      <div className="text-xs text-gray-500">{file.fileType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {file.downloads.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">downloads</div>
                  </div>
                </div>
              ))}
            {files.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No download data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagementPage;


