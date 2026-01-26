import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, MessageCircle, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

const Leads = () => {
  // Mock Data for UI demonstration
  const [leads] = useState([
    { id: '1', type: 'WHATSAPP', value: '+91 98765 43210', verified: true, date: '2026-01-25', country: 'IN', link: 'My eBook' },
    { id: '2', type: 'EMAIL', value: 'rahul@startup.com', verified: true, date: '2026-01-25', country: 'IN', link: 'Webinar Link' },
    { id: '3', type: 'WHATSAPP', value: '+91 99887 76655', verified: false, date: '2026-01-24', country: 'IN', link: 'My eBook' },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Generation</h1>
          <p className="text-gray-500 mt-1">Manage and export leads captured from your locked links</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MessageCircle className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">1,248</p>
          <span className="text-green-600 text-xs font-medium">↑ 12% from last week</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">WhatsApp Leads</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><MessageCircle className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">892</p>
          <span className="text-gray-400 text-xs">71% of total</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Email Leads</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">356</p>
          <span className="text-gray-400 text-xs">29% of total</span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by phone, email, or link..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source Link</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${lead.type === 'WHATSAPP' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {lead.type === 'WHATSAPP' ? <MessageCircle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-gray-900">{lead.value}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.link}
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
                    {lead.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
