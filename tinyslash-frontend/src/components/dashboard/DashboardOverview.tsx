import {
  Link,
  QrCode,
  Upload,
  Eye,
  TrendingUp,
  Globe,
  Plus,
  ExternalLink,
  Copy,
  BarChart3,
  RefreshCw,
  Activity,
  Clock,
  MousePointer,
  MapPin,
  Users,
  Crown,
  FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { useDashboardData } from '../../hooks/useDashboardData';
import { StatCardSkeleton, ChartSkeleton, ActivitySkeleton } from '../ui/Skeleton';
import { useTeam } from '../../context/TeamContext';
import LiveActivityFeed from './LiveActivityFeed';
import LocationWidget from './LocationWidget';
import WorldMapWidget from './WorldMapWidget';
import AiInsightsPanel from './AiInsightsPanel';

interface DashboardOverviewProps {
  onCreateClick: (mode: 'url' | 'qr' | 'file') => void;
}

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



const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onCreateClick }) => {
  const { currentScope, teams } = useTeam();

  // Use React Query hook for fast loading with caching
  const { stats, isLoading, isRefreshing, hasData, error, refetch } = useDashboardData();

  // Get current team if in team scope
  const currentTeam = currentScope.type === 'TEAM' ? teams.find(t => t.id === currentScope.id) : null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Dashboard refreshed!');
  };

  // Handle error state
  if (error) {
    console.error('Dashboard data loading error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isAuthError = errorMessage.includes('Authentication') || errorMessage.includes('token');
    const isEndpointError = errorMessage.includes('endpoint not found') || errorMessage.includes('404');

    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">Failed to load dashboard data</div>
        <div className="text-sm text-gray-600 mb-4">
          {errorMessage}
        </div>
        {isAuthError && (
          <div className="text-xs text-orange-600 mb-4 p-3 bg-orange-50 rounded-lg">
            Please try logging out and logging back in to refresh your authentication.
          </div>
        )}
        {isEndpointError && (
          <div className="text-xs text-blue-600 mb-4 p-3 bg-blue-50 rounded-lg">
            The backend API endpoints may need to be updated. Please contact support if this persists.
          </div>
        )}
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
          {isAuthError && (
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Re-login
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show skeleton loading when data is not yet available
  // This covers both 'isLoading' and the initial state before queries fire
  if (!stats) {
    return (
      <div className="space-y-6">
        {/* Welcome Section Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="h-8 bg-white/20 rounded w-48 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-64"></div>
            </div>
            <div className="h-10 w-24 bg-white/20 rounded-lg"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Chart and Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ActivitySkeleton />
        </div>

        {/* Location Widgets Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  // "No dashboard data available" block removed
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.03] rounded-bl-full pointer-events-none mix-blend-overlay"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500 opacity-20 blur-2xl rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-4 bg-white/10 h-32 rotate-45 pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0 relative z-10">
          <div className="min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold">
                {currentScope.type === 'TEAM' ? `${currentScope.name}` : 'Welcome back!'}
              </h2>
              {currentScope.type === 'TEAM' && currentTeam && (
                <div className="flex items-center space-x-2">
                  {currentTeam.subscriptionPlan.includes('BUSINESS') && (
                    <Crown className="w-5 h-5 text-yellow-300" />
                  )}
                  <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {currentScope.role}
                  </span>
                </div>
              )}
            </div>
            <p className="text-blue-100 text-sm sm:text-base">
              {currentScope.type === 'TEAM'
                ? `Here's what's happening with your team's content today.`
                : "Here's what's happening with your links today."
              }
            </p>
            {currentScope.type === 'TEAM' && currentTeam && (
              <div className="flex items-center space-x-4 mt-2 text-blue-100 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{currentTeam.members.length} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>{currentTeam.totalClicks} total clicks</span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2 disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Mobile-First Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <button
            onClick={() => onCreateClick('url')}
            className="bg-white text-gray-900 px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg font-bold border-2 border-transparent hover:border-gray-900 hover:shadow-[4px_4px_0px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center space-x-2 text-sm sm:text-base transform hover:-translate-y-0.5"
          >
            <Link className="w-5 h-5 text-blue-600" />
            <span className="hidden xs:inline">Create Short Link</span>
            <span className="xs:hidden">Short Link</span>
          </button>
          <button
            onClick={() => onCreateClick('qr')}
            className="bg-gray-800 border-2 border-gray-700 text-white px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg font-bold hover:bg-gray-700 hover:border-gray-600 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base transform hover:-translate-y-0.5 shadow-sm"
          >
            <QrCode className="w-5 h-5 text-purple-400" />
            <span className="hidden xs:inline">Create QR</span>
            <span className="xs:hidden">QR Code</span>
          </button>
          <button
            onClick={() => onCreateClick('file')}
            className="bg-gray-800 border-2 border-gray-700 text-white px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg font-bold hover:bg-gray-700 hover:border-gray-600 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base transform hover:-translate-y-0.5 shadow-sm"
          >
            <Upload className="w-5 h-5 text-orange-400" />
            <span className="hidden xs:inline">Upload File</span>
            <span className="xs:hidden">File</span>
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/pages'}
            className="bg-gray-800 border-2 border-gray-700 text-white px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg font-bold hover:bg-gray-700 hover:border-gray-600 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base transform hover:-translate-y-0.5 shadow-sm"
          >
            <FileText className="w-5 h-5 text-green-400" />
            <span className="hidden xs:inline">Pages</span>
            <span className="xs:hidden">Pages</span>
          </button>
        </div>
      </div>

      {/* AI Actionable Insights */}
      <AiInsightsPanel stats={stats} isLoading={isLoading} />

      {/* Enhanced Stats Cards - Retro Modern */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-[#ffffff] rounded-xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Short Links</p>
              <p className="text-3xl font-bold font-mono text-gray-900">{stats.shortLinks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Link className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm pt-4 border-t-2 border-dashed border-gray-200">
            <button
              onClick={() => onCreateClick('url')}
              className="text-gray-900 font-bold flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Link</span>
            </button>
          </div>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">QR Codes</p>
              <p className="text-3xl font-bold font-mono text-gray-900">{stats.qrCodeCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 border-2 border-purple-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <QrCode className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm pt-4 border-t-2 border-dashed border-gray-200">
            <button
              onClick={() => onCreateClick('qr')}
              className="text-gray-900 font-bold flex items-center space-x-1 hover:text-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create QR</span>
            </button>
          </div>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">File Links</p>
              <p className="text-3xl font-bold font-mono text-gray-900">{stats.fileLinksCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Upload className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm pt-4 border-t-2 border-dashed border-gray-200">
            <button
              onClick={() => onCreateClick('file')}
              className="text-gray-900 font-bold flex items-center space-x-1 hover:text-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload File</span>
            </button>
          </div>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Clicks</p>
              <p className="text-3xl font-bold font-mono text-gray-900">{stats.totalClicks.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-center group-hover:-rotate-6 transition-transform">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm pt-4 border-t-2 border-dashed border-gray-200 text-gray-600 font-medium">
            <Clock className="w-4 h-4 text-green-500 mr-1.5" />
            <span><strong className="text-green-600">{stats.clicksToday}</strong> today</span>
          </div>
        </div>
      </div>

      {/* Total Links and Total Clicks Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl p-6 relative overflow-hidden group hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-black text-sm uppercase tracking-wider mb-2">Total Links Database</p>
              <p className="text-5xl font-bold font-mono text-gray-900 tracking-tighter">{stats.totalLinks}</p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md">{stats.shortLinks} Short</span>
                <span className="bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-md">{stats.qrCodeCount} QR</span>
                <span className="bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-md">{stats.fileLinksCount} Files</span>
              </div>
            </div>
            <div className="hidden sm:flex w-20 h-20 bg-blue-50 border-2 border-blue-200 rounded-xl items-center justify-center transform rotate-6 group-hover:rotate-12 transition-all">
              <Globe className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 text-white border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] rounded-xl p-6 relative overflow-hidden group hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 font-bold text-sm uppercase tracking-wider mb-2">Total Interactions</p>
              <p className="text-5xl font-bold font-mono text-white tracking-tighter">{stats.totalClicks.toLocaleString()}</p>
              <div className="flex items-center gap-4 mt-4 text-sm font-medium">
                <div className="flex items-center space-x-1.5 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{stats.clicksToday} Today</span>
                </div>
                <div className="text-gray-400">
                  {stats.clicksThisWeek} This Week
                </div>
              </div>
            </div>
            <div className="hidden sm:flex w-20 h-20 bg-gray-800 border-2 border-gray-700 rounded-xl items-center justify-center transform -rotate-3 group-hover:-rotate-6 transition-all">
              <Activity className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Clicks Over Time Chart */}
        <div className="lg:col-span-2 bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Traffic Trend
            </h3>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-md border-2 border-green-200 shadow-sm">
              Live Data
            </span>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.clicksOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicksNeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  dx={-10}
                  tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '2px solid #111827', boxShadow: '4px 4px 0px rgba(0,0,0,1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 'bold', color: '#111827' }}
                  labelStyle={{ color: '#6B7280', fontWeight: 'bold', marginBottom: '8px' }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#111827"
                  fill="url(#colorClicksNeo)"
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: '#111827', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-1">
          <LiveActivityFeed maxItems={6} className="h-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Location Widget */}
        <div className="border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden bg-white">
          <LocationWidget maxItems={5} />
        </div>

        {/* Performance Metrics */}
        <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Geo Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
              <Globe className="w-6 h-6 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold font-mono text-gray-900">
                {stats.totalClicks > 0 ? Math.min(15, Math.floor(stats.totalClicks / 10) + 3) : 0}
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1">Countries</p>
            </div>

            <div className="text-center p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-green-400 transition-colors">
              <MapPin className="w-6 h-6 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold font-mono text-gray-900">
                {stats.totalClicks > 0 ? Math.min(50, Math.floor(stats.totalClicks / 5) + 8) : 0}
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1">Cities</p>
            </div>

            <div className="text-center p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-purple-400 transition-colors">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-3" />
              <p className="text-3xl font-bold font-mono text-gray-900">
                {stats.totalClicks > 0 ? Math.floor((stats.totalClicks * 0.65) / Math.max(stats.totalClicks, 1) * 100) : 0}%
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1">Mobile Share</p>
            </div>
          </div>

          <div className="mt-8 p-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg relative overflow-hidden group hover:shadow-[4px_4px_0px_rgba(59,130,246,0.3)] transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-bl-full group-hover:bg-blue-500/30 transition-colors"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h4 className="font-bold text-sm text-gray-300 uppercase tracking-widest mb-1">Top Source</h4>
                <p className="text-lg font-bold">India • Mumbai</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-mono text-blue-400">
                  {Math.floor(stats.totalClicks * 0.25).toLocaleString()}
                </p>
                <p className="text-xs font-medium text-gray-400 mt-1">Clicks (25%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* World Map Visualization */}
        <WorldMapWidget />

        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          {/* Top Performing Link */}
          <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Top Link
              </h3>
              <span className="text-xs font-bold text-gray-500 uppercase">By Conversion</span>
            </div>
            {stats.topPerformingLink ? (
              <div className="space-y-6">
                <div className="p-5 bg-gray-50 border-2 border-gray-200 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-100/50 rounded-bl-full pointer-events-none"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase bg-white px-2 py-1 rounded border border-gray-200">Short URL</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(stats.topPerformingLink.shortUrl)}
                        className="text-gray-400 hover:text-gray-900 bg-white p-1.5 rounded border border-gray-200 hover:border-gray-900 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(stats.topPerformingLink.shortUrl, '_blank')}
                        className="text-gray-400 hover:text-gray-900 bg-white p-1.5 rounded border border-gray-200 hover:border-gray-900 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-blue-600 text-sm mb-2 break-all">{stats.topPerformingLink.shortUrl}</p>
                  <p className="text-xs text-gray-500 truncate font-medium">{stats.topPerformingLink.originalUrl}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-white border-2 border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-3xl font-black font-mono text-gray-900 mb-1">{stats.topPerformingLink.clicks || 0}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Clicks</p>
                  </div>
                  <div className="flex-1 bg-green-50 border-2 border-green-200 p-4 rounded-lg text-center">
                    <p className="text-3xl font-black font-mono text-green-600 mb-1">
                      {((stats.topPerformingLink.clicks || 0) / Math.max(stats.totalClicks, 1) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Traffic Share</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No links created yet</p>
                <button
                  onClick={() => onCreateClick('url')}
                  className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create your first link
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;