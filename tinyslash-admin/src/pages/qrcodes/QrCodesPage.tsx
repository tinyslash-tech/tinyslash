import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QrCodeIcon,
  EyeIcon,
  TrashIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { adminApiEndpoints } from '../../services/api';
import DataTable, { Column } from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

// Define Interface
interface QrCode {
  id: string;
  qrCode: string;
  title: string;
  content: string;
  userId: string;
  scopeType: 'TEAM' | 'PERSONAL';
  contentType: 'URL' | 'WIFI' | 'VCARD' | 'FILE' | 'TEXT';
  format: string;
  size: number;
  backgroundColor: string;
  foregroundColor: string;
  totalScans: number;
  uniqueScans: number;
  lastScannedAt?: string;
  createdAt: string;
  status?: string; // Not in API typically, assuming derived or 'ACTIVE'
}

interface FilterOptions {
  search?: string;
  type?: string;
}

const QrCodesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [search, setSearch] = useState('');
  // const [filters, setFilters] = useState<FilterOptions>({}); // Filters if needed
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  // Fetch QR Codes
  const { data: qrData, isLoading } = useQuery({
    queryKey: ['qr', currentPage, pageSize, sortBy, sortOrder, search],
    queryFn: () => adminApiEndpoints.qr.list({
      page: currentPage - 1,
      size: pageSize,
      sortBy,
      sortOrder,
      search,
    }),
    keepPreviousData: true,
  });

  const deleteQrMutation = useMutation({
    mutationFn: (id: string) => adminApiEndpoints.qr.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['qr']);
      toast.success('QR Code deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete QR Code');
    },
  });

  const responseData = qrData?.data;
  const qrCodes = responseData?.data?.content || responseData?.content || [];
  const totalPages = responseData?.data?.totalPages || responseData?.totalPages || 0;
  const totalItems = responseData?.data?.totalElements || responseData?.totalElements || 0;

  const handleDelete = (qr: QrCode) => {
    if (window.confirm('Are you sure you want to delete this QR Code?')) {
      deleteQrMutation.mutate(qr.id);
    }
  };

  const getQRTypeColor = (type: string) => {
    switch (type) {
      case 'URL': return 'info';
      case 'WIFI': return 'success';
      case 'VCARD': return 'warning';
      case 'FILE': return 'error';
      default: return 'default';
    }
  };

  const columns: Column<QrCode>[] = [
    {
      key: 'title',
      label: 'QR Code',
      sortable: true,
      render: (_, qr) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
            <QrCodeIcon className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {qr.title || 'Untitled'}
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {qr.qrCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'contentType',
      label: 'Type',
      sortable: true,
      render: (type) => (
        <Badge variant={getQRTypeColor(type)}>
          {type}
        </Badge>
      ),
    },
    {
      key: 'totalScans',
      label: 'Scans',
      sortable: true,
      render: (scans, qr) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {scans?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-500">
            {qr.uniqueScans?.toLocaleString() || 0} unique
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (date) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const renderRowActions = (qr: QrCode) => (
    <div className="flex items-center gap-2">
      {/* View/Details could verify if working */}
      <Button
        variant="ghost"
        size="sm"
        icon={<EyeIcon className="w-4 h-4" />}
        onClick={() => {
          // Maybe open preview modal
          toast('Preview coming soon');
        }}
      />
      {hasPermission('qrcodes', 'delete') && (
        <Button
          variant="ghost"
          size="sm"
          icon={<TrashIcon className="w-4 h-4" />}
          onClick={() => handleDelete(qr)}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            QR Code Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor and manage system QR codes
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={qrCodes}
        loading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          pageSize,
          onPageChange: setCurrentPage,
        }}
        sorting={{
          sortBy,
          sortOrder,
          onSort: (key, order) => {
            setSortBy(key);
            setSortOrder(order);
          },
        }}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search QR codes...',
        }}
        actions={{
          row: renderRowActions,
        }}
        emptyState={
          <div className="text-center py-12">
            <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No QR Codes found
            </h3>
          </div>
        }
      />
    </div>
  );
};

export default QrCodesPage;
