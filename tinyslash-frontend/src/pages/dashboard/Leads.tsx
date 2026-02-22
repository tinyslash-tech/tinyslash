import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, MessageCircle, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';

interface Lead {
  id: string;
  leadType: 'WHATSAPP' | 'EMAIL' | 'BOTH';
  whatsapp?: string;
  email?: string;
  verified: boolean;
  createdAt: string;
  country?: string;
  linkId: string;
  qrCodeId?: string;
  source?: 'LINK' | 'QR' | 'FILE';
}

const Leads = () => {
  const { user } = useAuth();
  const [filterId, setFilterId] = useState('');
  const [activeTab, setActiveTab] = useState<'LINKS' | 'QR' | 'FILE'>('LINKS');
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ['leads', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const params = new URLSearchParams();
      params.append('userId', user.id);

      const res = await fetch(`${API_BASE}/v1/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
    enabled: !!user
  });

  // Client-side filtering for Tabs and ID Search
  const filteredLeads = leads.filter(lead => {
    // 1. Tab Filter
    let sourceMatch = false;
    if (activeTab === 'LINKS') sourceMatch = lead.source === 'LINK' || !lead.source;
    if (activeTab === 'QR') sourceMatch = lead.source === 'QR';
    if (activeTab === 'FILE') sourceMatch = lead.source === 'FILE';

    // 2. ID Search Filter
    const idMatch = filterId
      ? (activeTab === 'LINKS' || activeTab === 'FILE' ? lead.linkId?.includes(filterId) : lead.qrCodeId?.includes(filterId))
      : true;

    return sourceMatch && idMatch;
  });

  const handleExport = () => {
    if (!filteredLeads.length) return;

    // Simple CSV Export
    const headers = ['Type', 'Value', 'Verified', 'Date', 'Country', activeTab === 'QR' ? 'QR Code ID' : 'Link/File ID'];
    const rows = filteredLeads.map(l => [
      l.leadType,
      l.whatsapp || l.email || '-',
      l.verified ? 'Yes' : 'No',
      new Date(l.createdAt).toLocaleDateString(),
      l.country || '-',
      activeTab === 'QR' ? (l.qrCodeId || '-') : l.linkId
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab.toLowerCase()}_leads_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Generation</h1>
          <p className="text-gray-500 mt-1">Manage and export leads captured from your locked content</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={handleExport}
            disabled={!filteredLeads.length}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('LINKS')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'LINKS'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          Short Link Leads
        </button>
        <button
          onClick={() => setActiveTab('QR')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'QR'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          QR Code Leads
        </button>
        <button
          onClick={() => setActiveTab('FILE')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'FILE'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          File Leads
        </button>
      </div>

      {/* Stats Cards - Calculated from Filtered Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total {activeTab === 'QR' ? 'QR' : activeTab === 'FILE' ? 'File' : 'Link'} Leads</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MessageCircle className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{filteredLeads.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">WhatsApp Leads</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><MessageCircle className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {filteredLeads.filter(l => l.whatsapp || l.leadType === 'WHATSAPP').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Email Leads</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {filteredLeads.filter(l => l.email || l.leadType === 'EMAIL').length}
          </p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter by ID */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Filter by ${activeTab === 'LINKS' ? 'Link' : activeTab === 'FILE' ? 'File' : 'QR'} ID...`}
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
            <p className="text-gray-500 max-w-sm mt-1">
              {activeTab === 'QR'
                ? "You haven't captured any leads from your QR codes yet."
                : activeTab === 'FILE'
                  ? "No leads captured from your file links yet."
                  : "No leads captured from your short links."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {activeTab === 'LINKS' ? 'Link ID' : activeTab === 'FILE' ? 'File ID' : 'QR Code ID'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${lead.leadType === 'WHATSAPP' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          {lead.leadType === 'WHATSAPP' ? <MessageCircle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                        </div>
                        <span className="font-medium text-gray-900">{lead.whatsapp || lead.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activeTab === 'QR' ? (lead.qrCodeId || '-') : (lead.linkId || '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <XCircle className="w-3 h-3 mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.country || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Leads;
