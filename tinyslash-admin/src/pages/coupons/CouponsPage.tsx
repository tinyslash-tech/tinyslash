import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Trash2,
  Edit2,
  Tag,
  Percent,
  DollarSign
} from 'lucide-react';
import { adminApiEndpoints } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DataTable, { Column } from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  expiryDate?: string;
  active: boolean;
  applicablePlans: string[];
}

const CouponsPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    maxUses: '',
    expiryDate: '',
    applicablePlans: 'PRO_MONTHLY,BUSINESS_YEARLY'
  });

  // Fetch Coupons
  const { data: couponsData, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => adminApiEndpoints.billing.coupons.list(),
  });

  const createCouponMutation = useMutation({
    mutationFn: (data: any) => adminApiEndpoints.billing.coupons.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons']);
      setShowCreateModal(false);
      setNewCoupon({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        maxUses: '',
        expiryDate: '',
        applicablePlans: 'PRO_MONTHLY,BUSINESS_YEARLY'
      });
      toast.success('Coupon created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (id: string) => adminApiEndpoints.billing.coupons.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons']);
      toast.success('Coupon deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete coupon');
    }
  });

  const handleCreateCoupon = () => {
    const payload = {
      ...newCoupon,
      maxUses: parseInt(newCoupon.maxUses),
      discountValue: parseFloat(newCoupon.discountValue),
      applicablePlans: newCoupon.applicablePlans.split(',').map(p => p.trim())
    };
    createCouponMutation.mutate(payload);
  };

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCouponMutation.mutate(id);
    }
  };

  const rawData = couponsData?.data;
  const coupons = Array.isArray(rawData) ? rawData : (rawData?.data || []);

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      label: 'Coupon Code',
      sortable: true,
      render: (_, coupon) => (
        <div>
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-indigo-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{coupon.code}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{coupon.description}</div>
        </div>
      )
    },
    {
      key: 'discountValue',
      label: 'Discount',
      sortable: true,
      render: (_, coupon) => (
        <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
          {coupon.discountType === 'PERCENTAGE' ? (
            <><Percent size={14} className="text-gray-400" /> {coupon.discountValue}%</>
          ) : (
            <><DollarSign size={14} className="text-gray-400" /> {coupon.discountValue}</>
          )}
        </div>
      )
    },
    {
      key: 'usedCount',
      label: 'Usage',
      render: (_, coupon) => (
        <div>
          <div className="text-sm text-gray-900 dark:text-white">
            {coupon.usedCount} / {coupon.maxUses}
          </div>
          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${Math.min(100, (coupon.usedCount / coupon.maxUses) * 100)}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'expiryDate',
      label: 'Expiry',
      sortable: true,
      render: (date) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {date ? new Date(date).toLocaleDateString() : 'Never'}
        </span>
      )
    },
    {
      key: 'active',
      label: 'Status',
      sortable: true,
      render: (active) => (
        <Badge variant={active ? 'success' : 'error'}>
          {active ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const renderRowActions = (coupon: Coupon) => (
    <div className="flex items-center gap-2">
      {hasPermission('coupons', 'update') && (
        <Button
          variant="ghost"
          size="sm"
          icon={<Edit2 className="w-4 h-4" />}
          onClick={() => toast('Edit coming soon')}
        />
      )}
      {hasPermission('coupons', 'delete') && (
        <Button
          variant="ghost"
          size="sm"
          icon={<Trash2 className="w-4 h-4" />}
          onClick={() => handleDeleteCoupon(coupon.id)}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons & Promotions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage discount codes and promotional campaigns</p>
        </div>
        {hasPermission('coupons', 'create') && (
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={<Plus size={18} />}
          >
            Create Coupon
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        loading={isLoading}
        actions={{
          row: renderRowActions
        }}
        emptyState={
          <div className="flex flex-col items-center justify-center p-12">
            <Tag className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium">No coupons found</p>
            <p className="text-sm text-gray-500">Create a new coupon to get started</p>
          </div>
        }
      />

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" />
              Create New Coupon
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all uppercase font-mono"
                  placeholder="e.g., SUMMER2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  placeholder="e.g., 25% off for new users"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
                  <input
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g., 25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={newCoupon.maxUses}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g., 1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                  <input
                    type="datetime-local"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <Button
                onClick={handleCreateCoupon}
                loading={createCouponMutation.isPending}
              >
                Create Coupon
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
