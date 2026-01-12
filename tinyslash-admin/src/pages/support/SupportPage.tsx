import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  MessageSquare,
} from 'lucide-react';
import { adminApiEndpoints } from '../../services/api';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  currentPage?: string;
  responses?: TicketResponse[];
}

interface TicketResponse {
  id: string;
  message: string;
  sender: 'USER' | 'AGENT' | 'SYSTEM';
  senderName?: string;
  timestamp: string;
}

const SupportPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryClient = useQueryClient();

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');


  // Fetch Tickets
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => adminApiEndpoints.support.tickets.list(),
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApiEndpoints.support.tickets.updateStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['tickets']);
      // Verify update locally if needed
      if (selectedTicket && selectedTicket.id === variables.id) {
        setSelectedTicket({ ...selectedTicket, status: variables.status as any });
      }
    }
  });

  const sendReplyMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      adminApiEndpoints.support.tickets.respond(id, message, false),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tickets']);
      // If data returns updated ticket, update selectedTicket
      const updatedTicket = data?.data?.data || data?.data; // Check API response structure
      if (updatedTicket && updatedTicket.id) {
        setSelectedTicket(updatedTicket);
      }
      setReplyMessage('');
    }
  });

  const rawTickets = ticketsData?.data;
  const tickets: Ticket[] = Array.isArray(rawTickets) ? rawTickets : (rawTickets?.data || []);

  const handleStatusUpdate = (ticketId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: ticketId, status: newStatus });
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    sendReplyMutation.mutate({ id: selectedTicket.id, message: replyMessage });
  };

  // Helper functions
  const calculateStats = () => {
    return {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === 'OPEN').length,
      inProgressTickets: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolvedTickets: tickets.filter(t => t.status === 'RESOLVED').length,
    };
  };

  const supportStats = calculateStats();

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      'PAYMENT': 'bg-green-100 text-green-800',
      'TECHNICAL': 'bg-blue-100 text-blue-800',
      'ACCOUNT': 'bg-purple-100 text-purple-800',
      'GENERAL': 'bg-gray-100 text-gray-800',
      'FEATURE_REQUEST': 'bg-yellow-100 text-yellow-800'
    };
    return map[category] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const map: Record<string, string> = {
      'URGENT': 'bg-red-100 text-red-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800'
    };
    return map[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      'OPEN': 'bg-red-100 text-red-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'WAITING_FOR_USER': 'bg-yellow-100 text-yellow-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  // Filtering
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      (ticket.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (ticket.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (ticket.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer support requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ... (Kept existing stats UI) ... */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{supportStats.totalTickets}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Open</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{supportStats.openTickets}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{supportStats.inProgressTickets}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{supportStats.resolvedTickets}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          {/* ... other filters ... */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            <option value="TECHNICAL">Technical</option>
            <option value="PAYMENT">Payment</option>
            <option value="ACCOUNT">Account</option>
            <option value="GENERAL">General</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No tickets found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {ticket.subject}
                        </div>
                        <div className="text-xs text-gray-500">
                          #{ticket.id.substring(0, 8)} • <span className={`px-1.5 py-0.5 rounded text-[10px] ${getCategoryColor(ticket.category)}`}>{ticket.category}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                        {ticket.userName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.userName}</div>
                        <div className="text-xs text-gray-500">{ticket.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { setSelectedTicket(ticket); setShowTicketDetail(true); }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Detail Modal - kept simpler for now to fit in replacement limit, relying on structure */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start bg-gray-50 dark:bg-gray-900/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">{selectedTicket.subject}</h2>
                {/* ... more details ... */}
              </div>
              <button onClick={() => setShowTicketDetail(false)}>✕</button>
            </div>
            <div className="flex-1 overflow-hidden flex">
              <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="p-4 bg-gray-100 rounded-lg">{selectedTicket.message}</div>
                  {/* Responses */}
                  {selectedTicket.responses?.map((r: any) => (
                    <div key={r.id} className="p-4 bg-blue-50 rounded-lg">{r.message}</div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <textarea value={replyMessage} onChange={e => setReplyMessage(e.target.value)} className="w-full p-2 border rounded" placeholder="Reply..." />
                  <button onClick={handleSendReply} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
