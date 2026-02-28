import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { X, Check, Search, AlertCircle, Loader2 } from 'lucide-react';
import { inviteClient, InviteClientRequest } from '../../../services/api';
import toast from 'react-hot-toast';

interface InviteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InviteClientModal: React.FC<InviteClientModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch agency's pages using the existing api (which returns Page[])
  // Assumes `getUserPages` does not take any arguments or takes the userId.
  // Actually, wait, `api.ts` might have `getUserPages(userId)`. But wait, in the generic dashboard we just call an endpoint that relies on the backend's token? Let's check api.ts for `getUserPages`.
  // Wait, I will fix `getUserPages` call carefully after checking.

  // For now let's assume `api.getUserPages` is available or we use a custom fetch if needed.
  // Wait, `api.ts` is in `src/services/api.ts` but `getUserPages` doesn't exist? Oh wait, `api.ts` has `getUserUrls`.
  // Let's use `apiClient.get('/v1/pages')` directly.

  const { data: pages = [], isLoading: loadingPages } = useQuery({
    queryKey: ['agencyPagesForInvite'],
    queryFn: async () => {
      // Import apiClient from api.ts to make direct calls if a wrapper isn't available
      const { apiClient } = await import('../../../services/api');
      const response = await apiClient.get('/pages'); // The endpoint is /api/pages
      return response.data;
    },
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: inviteClient,
    onSuccess: () => {
      toast.success('Client invited successfully!');
      onSuccess();
      setFormData({ email: '', firstName: '', lastName: '' });
      setSelectedPages([]);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to invite client';
      toast.error(message);
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPages.length === 0) {
      toast.error('You must select at least one page to grant access to.');
      return;
    }
    mutation.mutate({
      ...formData,
      pageIds: selectedPages
    });
  };

  const filteredPages = pages.filter((p: any) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePage = (pageId: string) => {
    setSelectedPages(prev =>
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Invite Client</h2>
            <p className="text-sm text-gray-500 mt-1">Grant read-only access to their specific pages.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="client@example.com"
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Pages</label>
            <p className="text-xs text-gray-500 mb-4">Select the pages this client should be able to view orders and analytics for.</p>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search your pages..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
              {loadingPages ? (
                <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading your pages...
                </div>
              ) : filteredPages.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No pages found. Create a page first.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredPages.map((page: any) => (
                    <label
                      key={page.id}
                      className={`flex items-center p-3 cursor-pointer transition-colors ${selectedPages.includes(page.id) ? 'bg-indigo-50/50' : 'hover:bg-gray-100/50'
                        }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {page.title || 'Untitled Page'}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          tinyslash.com/{page.id}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ml-4 transition-colors ${selectedPages.includes(page.id)
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-300 text-transparent'
                        }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedPages.includes(page.id)}
                        onChange={() => togglePage(page.id)}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending || selectedPages.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Inviting...
              </>
            ) : (
              'Send Invite'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteClientModal;
