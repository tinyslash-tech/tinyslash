import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, UserPlus, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { getAgencyClients, ClientAccess } from '../../../services/api';
import toast from 'react-hot-toast';

// We'll import the modal once we create it
import InviteClientModal from '../../../components/dashboard/business/InviteClientModal';

const AgencyClients: React.FC = () => {
  const queryClient = useQueryClient();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Fetch Clients
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['agencyClients'],
    queryFn: getAgencyClients,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <ShieldAlert className="w-6 h-6 mr-2" />
        Failed to load clients. Ensure you have Agency permissions.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Client Management
          </h1>
          <p className="text-gray-500 mt-1">
            Invite clients and grant them access to specific pages or domains.
          </p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Invite Client
        </button>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {clients?.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              Start inviting clients to give them a restricted dashboard to view their page's orders, bookings, and analytics.
            </p>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              + Invite your first client
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                  <th className="py-4 px-6">Client ID</th>
                  <th className="py-4 px-6 text-center">Accessible Pages</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {clients?.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 border-t border-gray-100">
                      <div className="font-medium text-gray-900">{client.clientId}</div>
                      <div className="text-xs text-gray-500 mt-1">Linked via Agency</div>
                    </td>
                    <td className="py-4 px-6 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {client.allowedPageIds.map((pageId) => (
                          <div key={pageId} className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                              <FileText className="w-3 h-3" />
                              {pageId}
                            </span>
                            <a
                              href={`/dashboard/clients/review/${pageId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-indigo-600 hover:underline"
                            >
                              Review Draft
                            </a>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right border-t border-gray-100">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InviteClientModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => {
          setIsInviteModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['agencyClients'] });
        }}
      />
    </div>
  );
};

export default AgencyClients;
