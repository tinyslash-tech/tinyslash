
import React, { useState } from 'react';

// QR Code Management Page - Complete Implementation
const QRCodeManagementPage = ({ hasPermission }) => {
  const [activeTab, setActiveTab] = useState('qrcodes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  // Removed Bulk Modal state as per request to remove unnecessary UI

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodes, setQrCodes] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  React.useEffect(() => {
    fetchQrCodes();
  }, []);

  const fetchQrCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/v1/qr/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const mappedQRs = result.qrCodes.map((qr, index) => ({
            id: qr.id || `qr_${index}`,
            qrId: qr.qrCode,
            linkedUrl: qr.content, // Simplify for now
            originalUrl: qr.content,
            title: qr.title || 'Untitled QR',
            owner: qr.userId,
            ownerName: 'User', // Placeholder
            team: qr.scopeType === 'TEAM' ? 'Team' : 'Personal',
            qrType: qr.contentType || 'URL',
            format: qr.format,
            size: `${qr.size}x${qr.size}`,
            backgroundColor: qr.backgroundColor,
            foregroundColor: qr.foregroundColor,
            logo: false, // Not tracked in basic metadata yet
            logoUrl: null,
            created: qr.createdAt ? new Date(qr.createdAt).toLocaleDateString() : 'N/A',
            lastScanned: qr.lastScannedAt ? new Date(qr.lastScannedAt).toLocaleString() : 'Never',
            totalScans: qr.totalScans || 0,
            uniqueScans: qr.uniqueScans || 0,
            status: 'Active', // Default to active for now
            expiryDate: null,
            downloadCount: 0, // Not currently tracked
            analytics: qr.analytics || {
              countries: {},
              devices: {},
              referrers: {}
            }
          }));
          setQrCodes(mappedQRs);
        } else {
          throw new Error(result.message || "Failed to fetch QR codes");
        }
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching QR codes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // QR Code analytics
  const qrStats = {
    totalQRCodes: qrCodes.length,
    totalScans: qrCodes.reduce((sum, qr) => sum + qr.totalScans, 0),
    uniqueScans: qrCodes.reduce((sum, qr) => sum + qr.uniqueScans, 0),
    activeQRCodes: qrCodes.filter(qr => qr.status === 'Active').length,
    expiredQRCodes: qrCodes.filter(qr => qr.status === 'Expired').length,
    totalDownloads: qrCodes.reduce((sum, qr) => sum + qr.downloadCount, 0),
    qrTypes: {
      URL: qrCodes.filter(qr => qr.qrType === 'URL').length,
      WiFi: qrCodes.filter(qr => qr.qrType === 'WiFi').length,
      vCard: qrCodes.filter(qr => qr.qrType === 'vCard').length,
      File: qrCodes.filter(qr => qr.qrType === 'File').length,
      Text: qrCodes.filter(qr => qr.qrType === 'Text').length
    }
  };

  const getQRTypeColor = (type) => {
    switch (type) {
      case 'URL': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'WiFi': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'vCard': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'File': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Text': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getQRTypeIcon = (type) => {
    switch (type) {
      case 'URL': return '🔗';
      case 'WiFi': return '📶';
      case 'vCard': return '👤';
      case 'File': return '📁';
      case 'Text': return '📝';
      default: return '📱';
    }
  };

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qr.qrId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qr.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || qr.qrType.toLowerCase() === filterType;

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
            <p className="text-sm text-red-700">Error loading QR codes: {error}</p>
            <button
              onClick={fetchQrCodes}
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
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">QR Code Management</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Monitor and manage all system QR codes.</p>
        </div>
        {/* Removed Unnecessary Buttons */}
      </div>

      {/* Stats Cards - Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total QR Codes</p>
              <h3 className="text-3xl font-bold mt-1">{qrStats.totalQRCodes}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">📱</span>
            </div>
          </div>
          <p className="text-blue-100 text-xs mt-4 flex items-center">
            <span className="font-bold mr-1">{qrStats.activeQRCodes}</span> active
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Total Scans</p>
              <h3 className="text-3xl font-bold mt-1">{qrStats.totalScans.toLocaleString()}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">📷</span>
            </div>
          </div>
          <p className="text-emerald-100 text-xs mt-4">
            Lifetime interactions
          </p>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-violet-100 text-sm font-medium uppercase tracking-wider">Unique Scans</p>
              <h3 className="text-3xl font-bold mt-1">{qrStats.uniqueScans.toLocaleString()}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-violet-100 text-xs mt-4">
            Distinct users
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-amber-100 text-sm font-medium uppercase tracking-wider">Scan Rate</p>
              <h3 className="text-3xl font-bold mt-1">
                {qrStats.totalScans > 0 ? ((qrStats.uniqueScans / qrStats.totalScans) * 100).toFixed(1) : 0}%
              </h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <p className="text-amber-100 text-xs mt-4">
            Unique / Total
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search by title, ID, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Types</option>
              <option value="url">URL</option>
              <option value="wifi">WiFi</option>
              <option value="vcard">vCard</option>
              <option value="file">File</option>
              <option value="text">Text</option>
            </select>
          </div>
        </div>
      </div>

      {/* QR Codes Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">QR Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner / Context</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type / Specs</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredQRCodes.length > 0 ? (
                filteredQRCodes.map((qr) => (
                  <tr key={qr.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center mr-4 border border-gray-100 dark:border-gray-600 shadow-sm">
                          {/* Placeholder for real QR image if available in future */}
                          <span className="text-xl">{getQRTypeIcon(qr.qrType)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                            {qr.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded inline-block">
                            {qr.qrId}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Created: {qr.created}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 dark:text-white font-medium">{qr.ownerName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{qr.team}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getQRTypeColor(qr.qrType)}`}>
                          {qr.qrType}
                        </span>
                        <span className="text-xs text-gray-400">
                          {qr.format} • {qr.size}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                          <span className="mr-1.5 text-gray-400">👁️</span>
                          {qr.totalScans.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {qr.uniqueScans.toLocaleString()} unique
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${qr.status === 'Active'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${qr.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {qr.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl mb-3">🔍</span>
                      <p className="text-lg font-medium">No QR Codes found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">QR Code Types</h3>
          <div className="space-y-3">
            {Object.entries(qrStats.qrTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{getQRTypeIcon(type)}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getQRTypeColor(type)}`}>
                    {type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{count} QR codes</div>
                  <div className="text-xs text-gray-500">
                    {qrStats.totalQRCodes > 0 ? ((count / qrStats.totalQRCodes) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing QR Codes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing QR Codes</h3>
          <div className="space-y-3">
            {qrCodes
              .sort((a, b) => b.totalScans - a.totalScans)
              .slice(0, 5)
              .map((qr, index) => (
                <div key={qr.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mr-3">
                      <span className="text-sm">{getQRTypeIcon(qr.qrType)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {qr.title}
                      </div>
                      <div className="text-xs text-gray-500">{qr.qrType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {qr.totalScans.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">scans</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeManagementPage;
