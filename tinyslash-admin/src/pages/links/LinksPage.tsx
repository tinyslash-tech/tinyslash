import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LinkIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  QrCodeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { adminApiEndpoints } from '../../services/api';
import DataTable, { Column } from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

// Define interfaces locally if not in types/index.ts yet
interface Link {
  id: string;
  shortUrl: string;
  originalUrl: string;
  title: string;
  userId: string;
  domain: string;
  clicks: number;
  uniqueClicks: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
  createdAt: string;
  expiresAt?: string;
  hasQrCode: boolean;
  isPasswordProtected: boolean;
  tags: string[];
}

interface FilterOptions {
  search?: string;
  status?: string;
}

const LinksPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedLinkIds, setSelectedLinkIds] = useState<string[]>([]);

  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  // Fetch links
  const { data: linksData, isLoading } = useQuery({
    queryKey: ['links', currentPage, pageSize, sortBy, sortOrder, search, filters],
    queryFn: () => adminApiEndpoints.links.list({
      page: currentPage - 1,
      size: pageSize,
      sortBy,
      sortOrder,
      search,
      ...filters,
    }),
    keepPreviousData: true,
  });

  const deleteLinkMutation = useMutation({
    mutationFn: (id: string) => adminApiEndpoints.links.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['links']);
      toast.success('Link deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete link');
    },
  });

  const responseData = linksData?.data;
  const links = responseData?.data?.content || responseData?.content || [];
  const totalPages = responseData?.data?.totalPages || responseData?.totalPages || 0;
  const totalItems = responseData?.data?.totalElements || responseData?.totalElements || 0;

  const columns: Column<Link>[] = [
    {
      key: 'shortUrl',
      label: 'Link',
      sortable: true,
      render: (_, link) => (
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 font-mono truncate">
              {link.shortUrl}
            </span>
            {link.hasQrCode && <QrCodeIcon className="w-4 h-4 text-gray-400" title="QR Code" />}
            {link.isPasswordProtected && <LockClosedIcon className="w-4 h-4 text-yellow-500" title="Password Protected" />}
          </div>
          <div className="text-sm text-gray-900 dark:text-white font-medium truncate">
            {link.title || 'Untitled'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={link.originalUrl}>
            {link.originalUrl}
          </div>
        </div>
      ),
    },
    {
      key: 'clicks',
      label: 'Clicks',
      sortable: true,
      render: (clicks, link) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {clicks?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-500">
            {link.uniqueClicks?.toLocaleString() || 0} unique
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => (
        <Badge
          variant={
            status === 'ACTIVE' ? 'success' :
              status === 'EXPIRED' ? 'warning' : 'error'
          }
        >
          {status}
        </Badge>
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
    {
      key: 'expiresAt',
      label: 'Expires',
      sortable: true,
      render: (date) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {date ? new Date(date).toLocaleDateString() : 'Never'}
        </div>
      ),
    },
  ];

  const handleSort = (newSortBy: string, newSortOrder: 'ASC' | 'DESC') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleDeleteLink = (link: Link) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      deleteLinkMutation.mutate(link.id);
    }
  };

  const renderRowActions = (link: Link) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        icon={<ChartBarIcon className="w-4 h-4" />}
        onClick={() => window.open(`/links/${link.id}/analytics`, '_blank')}
        title="Analytics"
      />

      {hasPermission('links', 'update') && (
        <Button
          variant="ghost"
          size="sm"
          icon={<PencilIcon className="w-4 h-4" />}
          onClick={() => {
            toast.success('Edit link coming soon');
          }}
          title="Edit"
        />
      )}

      {hasPermission('links', 'delete') && (
        <Button
          variant="ghost"
          size="sm"
          icon={<TrashIcon className="w-4 h-4" />}
          onClick={() => handleDeleteLink(link)}
          title="Delete"
        />
      )}
    </div>
  );

  const bulkActions = [
    {
      label: 'Export Selected',
      action: (ids: string[]) => {
        toast.success('Export started');
      },
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Link Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage shortened links and view performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasPermission('links', 'export') && (
            <Button
              variant="secondary"
              icon={<ArrowDownTrayIcon className="w-4 h-4" />}
              onClick={() => toast.success('Export started')}
            >
              Export All
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={links}
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
          onSort: handleSort,
        }}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search links...',
        }}
        actions={{
          bulk: { actions: bulkActions },
          row: renderRowActions,
        }}
        selectable={hasPermission('links', 'bulk_actions')}
        onSelectionChange={setSelectedLinkIds}
        emptyState={
          <div className="text-center py-12">
            <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No links found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Links created by users will appear here.
            </p>
          </div>
        }
      />
    </div>
  );
};

export default LinksPage;
