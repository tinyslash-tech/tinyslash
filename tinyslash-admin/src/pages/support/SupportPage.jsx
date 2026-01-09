import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  MessageSquare,
  AlertCircle,
  User,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const SupportPage = ({ hasPermission }) => {
  // State for data
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/v1/support/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch tickets');

      const result = await response.json();
      if (result.success) {
        setTickets(result.data || []);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        status: newStatus,
        updatedBy: 'Admin', // In real app, get from auth context
        reason: 'Status updated by admin'
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/v1/support/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        // Update local state
        setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    try {
      setSendingReply(true);
      const token = localStorage.getItem('token');
      const payload = {
        message: replyMessage,
        sender: 'AGENT',
        senderId: 'admin-1', // Should be current user ID
        senderName: 'Support Agent', // Should be current user name
        senderEmail: 'support@example.com'
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/v1/support/tickets/${selectedTicket.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        // Refresh ticket data
        const updatedTicket = result.data;
        setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
        setReplyMessage('');
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  // Calculate stats from real data
  const calculateStats = () => {
    return {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === 'OPEN').length,
      inProgressTickets: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolvedTickets: tickets.filter(t => t.status === 'RESOLVED').length,
      unreadCount: 0, // Need read status logic on backend ideally
      categories: {
        payment: tickets.filter(t => t.category === 'PAYMENT').length,
        technical: tickets.filter(t => t.category === 'TECHNICAL').length,
        account: tickets.filter(t => t.category === 'ACCOUNT').length,
        general: tickets.filter(t => t.category === 'GENERAL').length
      }
    };
  };

  const supportStats = calculateStats();

  // Helper functions for UI
  const getCategoryColor = (category) => {
    const map = {
      'PAYMENT': 'bg-green-100 text-green-800',
      'TECHNICAL': 'bg-blue-100 text-blue-800',
      'ACCOUNT': 'bg-purple-100 text-purple-800',
      'GENERAL': 'bg-gray-100 text-gray-800',
      'FEATURE_REQUEST': 'bg-yellow-100 text-yellow-800'
    };
    return map[category] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const map = {
      'URGENT': 'bg-red-100 text-red-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800'
    };
    return map[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const map = {
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

  if (loading) {
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
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
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

      {/* Ticket Detail Modal */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start bg-gray-50 dark:bg-gray-900/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {selectedTicket.subject}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Ticket #{selectedTicket.id.substring(0, 8)}</span>
                  <span>•</span>
                  <span>Created {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(selectedTicket.category)}`}>
                    {selectedTicket.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowTicketDetail(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Chat Area */}
              <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Original Message */}
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-700 font-bold">
                      {selectedTicket.userName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">{selectedTicket.userName}</span>
                        <span className="text-xs text-gray-500">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="mt-1 p-4 bg-gray-100 dark:bg-gray-750 rounded-lg rounded-tl-none text-gray-800 dark:text-gray-200">
                        {selectedTicket.message}
                      </div>
                    </div>
                  </div>

                  {/* Responses */}
                  {selectedTicket.responses && selectedTicket.responses.map((response) => (
                    <div key={response.id} className={`flex gap-4 ${response.sender === 'USER' ? '' : 'flex-row-reverse'}`}>
                      <div className={`h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold ${response.sender === 'USER' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-600 text-white'
                        }`}>
                        {response.senderName?.charAt(0) || (response.sender === 'USER' ? 'U' : 'A')}
                      </div>
                      <div className="flex-1 max-w-[80%]">
                        <div className={`flex items-baseline justify-between ${response.sender === 'USER' ? '' : 'flex-row-reverse'}`}>
                          <span className="font-semibold text-gray-900 dark:text-white">{response.senderName}</span>
                          <span className="text-xs text-gray-500">{new Date(response.timestamp).toLocaleString()}</span>
                        </div>
                        <div className={`mt-1 p-4 rounded-lg text-gray-800 dark:text-gray-200 ${response.sender === 'USER'
                            ? 'bg-gray-100 dark:bg-gray-750 rounded-tl-none'
                            : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-tr-none'
                          }`}>
                          {response.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div className="relative">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full pl-4 pr-4 pt-3 pb-12 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      rows="3"
                    />
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button
                        onClick={handleSendReply}
                        disabled={sendingReply || !replyMessage.trim()}
                        className={`px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {sendingReply ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="w-80 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Meta Data</h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusUpdate(selectedTicket.id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="WAITING_FOR_USER">Waiting for User</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">User Info</label>
                    <div className="mt-2 text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">{selectedTicket.userName}</div>
                      <div className="text-gray-500">{selectedTicket.userEmail}</div>
                      <div className="text-xs text-gray-400 mt-1 font-mono">{selectedTicket.userId}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Tech Details</label>
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>IP:</span>
                        <span className="font-mono">{selectedTicket.ipAddress || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Browser:</span>
                        <span className="truncate max-w-[150px]" title={selectedTicket.userAgent}>{selectedTicket.userAgent || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Page:</span>
                        <span>{selectedTicket.currentPage || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
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
