import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, CalendarDays, CreditCard, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '../../../context/AuthContext';
import { getBusinessOrders, getBusinessBookings, getBusinessPayouts } from '../../../services/api';

const OrdersView = ({ pageId }: { pageId: string | null }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await getBusinessOrders(pageId);
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [pageId]);

  if (isLoading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-900 border-b border-gray-200 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Item (Type)</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No orders found.</td></tr>
          ) : (
            orders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{o.customerName}</div>
                  <div className="text-xs text-gray-500">{o.customerEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <div>{o.monetizationType === 'DIGITAL_FILE' ? 'Digital Download' : 'Service'}</div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{o.amount / 100}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${o.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const BookingsView = ({ pageId }: { pageId: string | null }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const data = await getBusinessBookings(pageId);
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to fetch bookings:");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [pageId]);

  if (isLoading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-900 border-b border-gray-200 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Session Date</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Meeting Link / Details</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.length === 0 ? (
            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No upcoming bookings found.</td></tr>
          ) : (
            bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50 text-gray-900">
                <td className="px-6 py-4 font-bold whitespace-nowrap text-blue-900 bg-blue-50/50">
                  {new Date(b.bookingDate).toLocaleDateString()}
                  <div className="text-xs font-medium text-blue-600 mt-1">
                    {new Date(b.bookingStartUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold">{b.customerName}</div>
                  <div className="text-xs text-gray-500">{b.customerEmail}</div>
                </td>
                <td className="px-6 py-4">
                  {b.status === 'CONFIRMED' ? (
                    <div className="text-sm bg-gray-100 p-2 border border-gray-200 rounded">
                      Link generated and sent to email.
                    </div>
                  ) : <span className="text-gray-400 italic">Pending payment</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const PayoutsView = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      setIsLoading(true);
      try {
        const res = await getBusinessPayouts();
        setData(res);
      } catch (err) {
        console.error("Failed to fetch payouts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  if (isLoading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="text-sm font-semibold text-green-800 uppercase tracking-widest mb-1">Total Earned</div>
          <div className="text-4xl font-black text-green-600">₹{(data?.totalRevenuePaise || 0) / 100}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-1">Transactions</div>
          <div className="text-4xl font-black text-gray-900">{data?.totalTransactions || 0}</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col justify-center items-center text-center">
          <span className="text-sm font-bold text-blue-800 mb-2">Connect Stripe/Razorpay</span>
          <span className="text-xs text-blue-600">All funds map directly to your connected bank account automatically.</span>
        </div>
      </div>

      <div className="text-center p-12 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Global Financial Ledger</h3>
        <p className="text-gray-500 max-w-md mx-auto">This ledger tracks all confirmed payments sent directly to your connected gateway account (minus platform fees).</p>
      </div>
    </div>
  );
};

interface BusinessHubProps {
  view: 'orders' | 'bookings' | 'payouts';
}

const BusinessHub = ({ view = 'orders' }: { view?: 'orders' | 'bookings' | 'payouts' }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Enforce client restrictions preventing payouts access
  useEffect(() => {
    if (view === 'payouts' && user?.roles?.includes('ROLE_CLIENT')) {
      navigate('/dashboard/business/orders', { replace: true });
    }
  }, [view, user, navigate]);

  // The magic Page Filter
  const pageIdFromUrl = searchParams.get('pageId');
  const pageNameFromUrl = searchParams.get('pageName');
  const [activePageFilter, setActivePageFilter] = useState<string | null>(pageIdFromUrl);
  const [activePageName, setActivePageName] = useState<string | null>(pageNameFromUrl);

  // Sync state with URL
  useEffect(() => {
    setActivePageFilter(searchParams.get('pageId'));
    setActivePageName(searchParams.get('pageName'));
  }, [searchParams]);

  // Tab Navigation Handling
  const handleTabClick = (newView: string) => {
    // Preserve the page filter when switching tabs!
    if (activePageFilter) {
      if (activePageName) {
        navigate(`/dashboard/business/${newView}?pageId=${activePageFilter}&pageName=${encodeURIComponent(activePageName)}`);
      } else {
        navigate(`/dashboard/business/${newView}?pageId=${activePageFilter}`);
      }
    } else {
      navigate(`/dashboard/business/${newView}`);
    }
  };

  const rawTabs = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'payouts', label: 'Payouts', icon: CreditCard }
  ];

  const tabs = user?.roles?.includes('ROLE_CLIENT')
    ? rawTabs.filter(t => t.id !== 'payouts')
    : rawTabs;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Top Header & Sticky Page Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Business Hub
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage your global sales, bookings, and payouts.</p>
            </div>

            {/* Global Agency Filter Dropdown (Stub) */}
            <div className="relative">
              <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                {activePageFilter ? `Filtered: ${activePageName || activePageFilter}` : 'All Pages (Global Ledger)'}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-t border-gray-200 mt-6 pt-2 overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap
                  ${view === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className={`w-4 h-4 ${view === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Context Warning if Filtered */}
        {activePageFilter && view !== 'payouts' && (
          <div className="mb-6 bg-blue-50 pt-4 pb-3 px-4 rounded-xl border border-blue-100 flex items-start">
            <div className="flex-shrink-0">
              <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">i</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Page Filter Active</h3>
              <p className="mt-1 text-sm text-blue-600">
                You are viewing a filtered slice of your business. Showing only results generated by: <strong>{activePageName || activePageFilter}</strong>.
              </p>
            </div>
          </div>
        )}

        {view === 'payouts' && activePageFilter && (
          <div className="mb-6 bg-amber-50 pt-4 pb-3 px-4 rounded-xl border border-amber-100 flex items-start">
            <div className="ml-3 mt-1">
              <h3 className="text-sm font-medium text-amber-800">Filter Ignored</h3>
              <p className="mt-1 text-sm text-amber-600">
                Payouts are processed at the Account level. The page filter has been temporarily ignored for this view.
              </p>
            </div>
          </div>
        )}

        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {view === 'orders' && <OrdersView pageId={activePageFilter} />}
            {view === 'bookings' && <BookingsView pageId={activePageFilter} />}
            {view === 'payouts' && <PayoutsView />}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BusinessHub;
