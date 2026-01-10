import { useQuery, useQueries } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

// Types
interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  totalQRCodes: number;
  totalFiles: number;
  shortLinks: number;
  qrCodeCount: number;
  fileLinksCount: number;
  clicksToday: number;
  clicksThisWeek: number;
  topPerformingLink: any;
  recentActivity: any[];
  clicksOverTime: any[];
}

// API functions
import { getUserUrls, getUserQrCodes, getUserFiles } from '../services/api';

const fetchUserUrlsFn = async (userId: string) => {
  try {
    const data = await getUserUrls(userId);
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    throw error;
  }
};

const fetchUserQRCodesFn = async (userId: string) => {
  try {
    const data = await getUserQrCodes(userId);
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching user QR codes:', error);
    throw error;
  }
};

const fetchUserFilesFn = async (userId: string) => {
  try {
    const data = await getUserFiles(userId);
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching user files:', error);
    throw error;
  }
};

// Process raw data into dashboard stats
const processDashboardData = (links: any[], qrCodes: any[], files: any[]): DashboardStats => {
  const shortLinks = links.filter((link: any) => !link.isFileLink);
  const totalClicks = links.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0);
  const totalQRScans = qrCodes.reduce((sum: number, qr: any) => sum + (qr.scans || 0), 0);

  // Calculate time-based data
  const today = new Date();
  const todayStr = today.toDateString();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const clicksToday = links
    .filter((link: any) => new Date(link.createdAt).toDateString() === todayStr)
    .reduce((sum: number, link: any) => sum + (link.clicks || 0), 0);

  const clicksThisWeek = links
    .filter((link: any) => new Date(link.createdAt) >= weekAgo)
    .reduce((sum: number, link: any) => sum + (link.clicks || 0), 0);

  // Generate time series data
  const clicksOverTime = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toDateString();

    const dayLinks = links.filter((link: any) =>
      new Date(link.createdAt).toDateString() === dateStr
    );

    const dayClicks = dayLinks.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0);

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks: dayClicks || 0,
      links: dayLinks.length
    };
  });

  // Create recent activity
  const allActivity = [
    ...links.map((link: any) => ({
      ...link,
      type: 'link',
      action: 'created',
      timestamp: link.createdAt
    })),
    ...qrCodes.map((qr: any) => ({
      ...qr,
      type: 'qr',
      action: 'generated',
      timestamp: qr.createdAt
    })),
    ...files.map((file: any) => ({
      ...file,
      type: 'file',
      action: 'uploaded',
      timestamp: file.createdAt
    }))
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const topPerformingLink = links.length > 0
    ? links.reduce((max: any, link: any) =>
      (link.clicks || 0) > (max.clicks || 0) ? link : max
    )
    : null;

  return {
    totalLinks: links.length,
    totalClicks: totalClicks + totalQRScans,
    totalQRCodes: qrCodes.length,
    totalFiles: files.length,
    shortLinks: shortLinks.length,
    qrCodeCount: qrCodes.length,
    fileLinksCount: files.length,
    clicksToday,
    clicksThisWeek,
    topPerformingLink,
    recentActivity: allActivity,
    clicksOverTime
  };
};

// Custom hooks
export const useDashboardData = () => {
  const { user, token } = useAuth();

  // Check if we have both user and token before making API calls
  const isAuthenticated = !!user?.id && !!token;

  // Use parallel queries for better performance
  const queries = useQueries({
    queries: [
      {
        queryKey: ['user-urls', user?.id],
        queryFn: () => fetchUserUrlsFn(user!.id),
        enabled: isAuthenticated,
        staleTime: 3 * 60 * 1000,
        retry: 2,
        retryDelay: 1000,
      },
      {
        queryKey: ['user-qrcodes', user?.id],
        queryFn: () => fetchUserQRCodesFn(user!.id),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        retry: 2,
        retryDelay: 1000,
      },
      {
        queryKey: ['user-files', user?.id],
        queryFn: () => fetchUserFilesFn(user!.id),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        retry: 2,
        retryDelay: 1000,
      }
    ]
  });

  const [urlsQuery, qrCodesQuery, filesQuery] = queries;

  // Check if any query is loading for the first time (no cached data)
  const isInitialLoading = queries.some(query => query.isLoading && !query.data);

  // Check if any query is fetching in background
  const isRefreshing = queries.some(query => query.isFetching && query.data);

  // Check if all queries have data (from cache or fresh)
  const hasData = queries.every(query => query.data !== undefined);

  // Process data when available
  const stats = hasData
    ? processDashboardData(
      urlsQuery.data || [],
      qrCodesQuery.data || [],
      filesQuery.data || []
    )
    : null;

  return {
    stats,
    isLoading: isInitialLoading,
    isRefreshing,
    hasData,
    error: queries.find(query => query.error)?.error,
    refetch: () => queries.forEach(query => query.refetch())
  };
};

// Hook for individual data types (for specific components)
export const useUserUrls = () => {
  const { user, token } = useAuth();
  const isAuthenticated = !!user?.id && !!token;

  return useQuery({
    queryKey: ['user-urls', user?.id],
    queryFn: () => fetchUserUrlsFn(user!.id),
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

export const useUserQRCodes = () => {
  const { user, token } = useAuth();
  const isAuthenticated = !!user?.id && !!token;

  return useQuery({
    queryKey: ['user-qrcodes', user?.id],
    queryFn: () => fetchUserQRCodesFn(user!.id),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

export const useUserFiles = () => {
  const { user, token } = useAuth();
  const isAuthenticated = !!user?.id && !!token;

  return useQuery({
    queryKey: ['user-files', user?.id],
    queryFn: () => fetchUserFilesFn(user!.id),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
};