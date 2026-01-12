import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DocumentIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  LockClosedIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { adminApiEndpoints } from '../../services/api';
import DataTable, { Column } from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

// Define Interface
interface FileItem {
  id: string;
  fileCode: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  owner: string; // userId
  shortUrl: string;
  uploadDate: string; // or createdAt
  downloads: number;
  status: string;
  isPublic: boolean;
  hasPassword: boolean;
  expiryDate?: string;
}

const FilesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [search, setSearch] = useState('');

  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Files
  const { data: filesData, isLoading } = useQuery({
    queryKey: ['files', currentPage, pageSize, sortBy, sortOrder, search],
    queryFn: () => adminApiEndpoints.files.list({
      page: currentPage - 1,
      size: pageSize,
      sortBy,
      sortOrder,
      search,
    }),
    keepPreviousData: true,
  });

  const deleteFileMutation = useMutation({
    mutationFn: (id: string) => adminApiEndpoints.files.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      toast.success('File deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete file');
    },
  });

  const responseData = filesData?.data;
  const files = responseData?.data?.content || responseData?.content || [];
  const totalPages = responseData?.data?.totalPages || responseData?.totalPages || 0;
  const totalItems = responseData?.data?.totalElements || responseData?.totalElements || 0;

  const handleDelete = (file: FileItem) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteFileMutation.mutate(file.id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pdf')) return 'error';
    if (t.includes('image')) return 'warning';
    if (t.includes('video')) return 'info';
    return 'default';
  };

  const columns: Column<FileItem>[] = [
    {
      key: 'fileName',
      label: 'File',
      sortable: true,
      render: (_, file) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
            <DocumentIcon className="w-6 h-6 text-gray-500" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={file.fileName}>
              {file.fileName}
            </div>
            <div className="text-xs text-blue-600 font-mono truncate max-w-[200px]">
              {file.shortUrl}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'fileSize',
      label: 'Size',
      sortable: true,
      render: (size) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatFileSize(size)}
        </span>
      ),
    },
    {
      key: 'downloads',
      label: 'Downloads',
      sortable: true,
      render: (downloads) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {downloads?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => (
        <Badge variant={status === 'Active' ? 'success' : 'error'}>
          {status}
        </Badge>
      ),
    },
    {
      key: 'isPublic', // Custom render helps
      label: 'Access',
      render: (_, file) => (
        <div className="flex gap-1">
          {file.isPublic ? (
            <Badge variant="info">Public</Badge>
          ) : (
            <Badge variant="default">Private</Badge>
          )}
          {file.hasPassword && <Badge variant="warning">Protected</Badge>}
        </div>
      )
    },
    {
      key: 'uploadDate',
      label: 'Uploaded',
      sortable: true,
      render: (date) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const renderRowActions = (file: FileItem) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        icon={<EyeIcon className="w-4 h-4" />}
        onClick={() => {
          toast('Preview coming soon');
        }}
      />
      {hasPermission('files', 'delete') && (
        <Button
          variant="ghost"
          size="sm"
          icon={<TrashIcon className="w-4 h-4" />}
          onClick={() => handleDelete(file)}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            File Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor file uploads and usage
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={files}
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
          placeholder: 'Search files...',
        }}
        actions={{
          row: renderRowActions,
        }}
        emptyState={
          <div className="text-center py-12">
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No files found
            </h3>
          </div>
        }
      />
    </div>
  );
};

export default FilesPage;
