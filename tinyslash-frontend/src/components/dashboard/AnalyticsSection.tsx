import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ChartSkeleton, StatCardSkeleton } from '../ui/Skeleton';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Smartphone,
  Calendar,
  Download,
  Share2,
  Eye,
  Clock,
  MapPin,
  Users,
  RefreshCw,
  Megaphone,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LocationAnalytics from './LocationAnalytics';
import AiInsightsPanel from './AiInsightsPanel';
import { PixelService, PixelPerformance } from '../../services/PixelService';

const AnalyticsSection: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'location' | 'performance'>('overview');
  const [pixelPerf, setPixelPerf] = useState<PixelPerformance | null>(null);
  const [pixelPerfLoading, setPixelPerfLoading] = useState(false);

  // Use React Query for fast loading with caching
  const { stats, isLoading, isRefreshing, hasData, error, refetch } = useDashboardData();

  // Load pixel performance when performance tab is active
  useEffect(() => {
    if (activeTab === 'performance' && user?.id && !pixelPerf && !pixelPerfLoading) {
      setPixelPerfLoading(true);
      PixelService.getPixelPerformance(user.id, 30)
        .then(setPixelPerf)
        .catch(() => { }) // silently fail
        .finally(() => setPixelPerfLoading(false));
    }
  }, [activeTab, user?.id]);

  // Process analytics data from React Query stats
  const analyticsData = stats ? (() => {
    // Transform real device data from backend { "MOBILE": 45, "DESKTOP": 20 } → chart format
    const deviceData = Object.keys(stats.clicksByDevice).length > 0
      ? (() => {
        const total = Object.values(stats.clicksByDevice).reduce((sum, v) => sum + v, 0);
        return Object.entries(stats.clicksByDevice)
          .sort(([, a], [, b]) => b - a)
          .map(([device, count]) => ({
            device: device || 'Unknown',
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
          }));
      })()
      : [];

    // Transform real location data from backend { "India": 40, "USA": 10 } → chart format
    const locationData = Object.keys(stats.clicksByCountry).length > 0
      ? Object.entries(stats.clicksByCountry)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([country, count]) => ({ country: country || 'Unknown', city: '', count }))
      : [];

    // Transform real browser data from backend { "Chrome": 30, "Safari": 15 } → chart format
    const browserData = Object.keys(stats.clicksByBrowser).length > 0
      ? Object.entries(stats.clicksByBrowser)
        .sort(([, a], [, b]) => b - a)
        .map(([browser, count]) => ({ browser: browser || 'Unknown', count }))
      : [];

    return {
      totalLinks: stats.totalLinks,
      totalClicks: stats.totalClicks,
      totalQRCodes: stats.totalQRCodes,
      totalScans: stats.totalClicks,
      totalFileLinks: stats.totalFiles,
      uniqueVisitors: stats.totalUniqueClicks || 0,
      avgClicksPerDay: stats.clicksOverTime.length > 0
        ? Math.floor(stats.totalClicks / Math.max(stats.clicksOverTime.length, 1))
        : 0,
      clicksOverTime: stats.clicksOverTime,
      deviceData,
      locationData,
      browserData,
      topLinks: stats.topPerformingLink ? [stats.topPerformingLink] : []
    };
  })() : null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const handleRefresh = () => {
    refetch();
  };

  // Handle error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-red-600 mb-4">Failed to load analytics data</div>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show skeleton loading when no cached data
  if (isLoading && !hasData) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Navigation Tabs Skeleton */}
        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-900 border-dashed">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            Analytics Engine
          </h2>
          <p className="text-gray-600 mt-2 font-medium">
            Deep dive into your traffic metrics and performance data.
            {isRefreshing && <span className="text-blue-600 ml-2 font-bold animate-pulse">(Syncing...)</span>}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white border-2 border-gray-900 text-gray-900 px-4 py-2.5 rounded-lg font-bold hover:bg-gray-50 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] disabled:opacity-50 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2.5 border-2 border-gray-900 rounded-lg font-bold text-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[position:right_16px_center] bg-no-repeat pr-10"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* AI Insights for Analytics Context */}
      <AiInsightsPanel stats={stats} isLoading={isLoading} context="analytics" />

      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] max-w-3xl overflow-x-auto my-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap min-w-max ${activeTab === 'overview'
            ? 'bg-white text-gray-900 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-bold'
            : 'text-gray-600 border-2 border-transparent hover:text-gray-900 hover:bg-gray-200 font-semibold'
            }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>General Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap min-w-max ${activeTab === 'location'
            ? 'bg-white text-gray-900 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-bold'
            : 'text-gray-600 border-2 border-transparent hover:text-gray-900 hover:bg-gray-200 font-semibold'
            }`}
        >
          <Globe className="w-4 h-4" />
          <span>Location</span>
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap min-w-max ${activeTab === 'performance'
            ? 'bg-white text-gray-900 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-bold'
            : 'text-gray-600 border-2 border-transparent hover:text-gray-900 hover:bg-gray-200 font-semibold'
            }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Detailed Perf</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'location' && (
        <LocationAnalytics timeRange={timeRange} />
      )}

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#ffffff] rounded-xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 font-bold px-2.5 py-1 rounded border border-gray-200">
                  Total Interactions
                </span>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Clicks</p>
              <p className="text-4xl font-bold font-mono text-gray-900">{analyticsData?.totalClicks?.toLocaleString() || 0}</p>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 font-bold px-2.5 py-1 rounded border border-gray-200">
                  Audience
                </span>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Unique Visitors</p>
              <p className="text-4xl font-bold font-mono text-gray-900">{analyticsData?.uniqueVisitors?.toLocaleString() || 0}</p>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 border-2 border-purple-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 font-bold px-2.5 py-1 rounded border border-gray-200">
                  Assets
                </span>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Links</p>
              <p className="text-4xl font-bold font-mono text-gray-900">{analyticsData?.totalLinks || 0}</p>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 font-bold px-2.5 py-1 rounded border border-gray-200">
                  Daily Avg
                </span>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Avg. Daily Clicks</p>
              <p className="text-4xl font-bold font-mono text-gray-900">{analyticsData?.avgClicksPerDay || 0}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clicks Over Time */}
            <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Traffic Volume
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData?.clicksOverTime || []}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '2px solid #111827', boxShadow: '4px 4px 0px rgba(0,0,0,1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    labelStyle={{ color: '#6B7280', fontWeight: 'bold', marginBottom: '8px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorClicks)"
                    name="Clicks"
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#111827', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorVisitors)"
                    name="Visitors"
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#111827', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Device Breakdown */}
            <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-8">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Device Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData?.deviceData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ device, percentage }) => `${device} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(analyticsData?.deviceData || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '2px solid #111827', boxShadow: '4px 4px 0px rgba(0,0,0,1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Analytics Content */}
          <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] my-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Performance Summary
            </h3>
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-2">Analytics Dashboard</h4>
              <p className="text-gray-600 font-medium">Detailed analytics with real data integration</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Browser Usage */}
          <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-8">
              <Globe className="w-5 h-5 text-blue-600" />
              Browser Landscape
            </h3>
            {(analyticsData?.browserData || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData?.browserData || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="browser" tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: '2px solid #111827', boxShadow: '4px 4px 0px rgba(0,0,0,1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold', color: '#111827' }}
                  />
                  <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium text-gray-600">No browser data yet</p>
                  <p className="text-sm mt-1">Analytics will appear once links are clicked.</p>
                </div>
              </div>
            )}
          </div>

          {/* Campaign Performance */}
          <div className="bg-[#ffffff] rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
            <div className="px-6 py-5 bg-gray-100 border-b-2 border-gray-900">
              <div className="flex items-center gap-3">
                <Megaphone className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Campaign Overview</h3>
              </div>
            </div>
            <div className="p-0">
              {(stats?.campaignDetails || []).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-50 border-b-2 border-gray-900">
                      <tr>
                        <th className="py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-xs">Campaign</th>
                        <th className="py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-xs text-right">Clicks</th>
                        <th className="py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-xs text-right">Links</th>
                        <th className="py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-xs">Platform</th>
                        <th className="py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-xs">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100">
                      {stats?.campaignDetails.map((campaign: any, index: number) => (
                        <tr key={index} className="hover:bg-blue-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <Target className="w-5 h-5 text-indigo-500" />
                              <span className="font-bold text-gray-900 text-base">{campaign.campaign}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="font-black text-gray-900 font-mono text-lg">{campaign.totalClicks.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-6 text-right font-medium text-gray-600 font-mono text-lg">{campaign.totalLinks}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-900 font-bold text-xs uppercase border border-blue-200">
                              {campaign.source || '—'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 rounded bg-green-100 text-green-900 font-bold text-xs uppercase border border-green-200">
                              {campaign.medium || '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-500 bg-gray-50">
                  <div className="text-center">
                    <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-bold text-gray-900 uppercase tracking-wide">No campaigns yet</p>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Add UTM tracking when creating links.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pixel Performance SaaS Card */}
          <div className="bg-[#ffffff] rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
            <div className="px-6 py-5 bg-gray-100 border-b-2 border-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Pixel Activity</h3>
              </div>
              <span className="text-xs font-bold text-gray-900 uppercase bg-[#ffffff] px-3 py-1.5 rounded-lg border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]">Last 30 Days</span>
            </div>
            <div className="p-6">
              {pixelPerfLoading && (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="h-40 bg-gray-200 rounded-lg mt-6" />
                </div>
              )}
              {!pixelPerfLoading && pixelPerf && (
                <>
                  {/* Summary stats */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-5 bg-green-50 rounded-xl border-2 border-green-200 relative overflow-hidden group hover:border-green-400 transition-colors">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-200 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                      <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-xs text-green-800 font-bold uppercase tracking-wider">Captured</span>
                      </div>
                      <p className="text-4xl font-black font-mono text-green-700 relative z-10">{pixelPerf.totalFired.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-5 bg-red-50 rounded-xl border-2 border-red-200 relative overflow-hidden group hover:border-red-400 transition-colors">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-200 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                      <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-xs text-red-800 font-bold uppercase tracking-wider">Missed</span>
                      </div>
                      <p className="text-4xl font-black font-mono text-red-700 relative z-10">{pixelPerf.totalFailed.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-5 bg-indigo-50 rounded-xl border-2 border-indigo-200 relative overflow-hidden group hover:border-indigo-400 transition-colors">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-200 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                      <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        <span className="text-xs text-indigo-800 font-bold uppercase tracking-wider">Fire Rate</span>
                      </div>
                      <p className="text-4xl font-black font-mono text-indigo-700 relative z-10">{pixelPerf.fireRate}%</p>
                    </div>
                  </div>

                  {/* P4: Fire Rate Alert — shown when fire rate < 80% */}
                  {pixelPerf.fireRateAlert && (
                    <div className="mb-8 flex items-start gap-4 p-5 bg-amber-50 border-2 border-amber-300 rounded-xl shadow-[4px_4px_0px_rgba(251,191,36,0.3)]">
                      <AlertTriangle className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-base font-black text-amber-900 uppercase tracking-wide">Pixel Fire Rate Critical</p>
                        <p className="text-sm text-amber-800 mt-1 font-medium leading-relaxed">
                          Elevated failure rate detected. Possible causes: expired tokens, invalid ID, or API rate limits. Review pixel configuration immediately.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Daily trend */}
                  {pixelPerf.byDay.length > 0 && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Daily Firing Trend</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={pixelPerf.byDay}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                          <YAxis tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} dx={-10} />
                          <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '2px solid #111827', padding: '12px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Bar dataKey="fired" name="Captured" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                          <Bar dataKey="failed" name="Missed" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Per-pixel breakdown */}
                  {pixelPerf.byPixel.length > 0 && (
                    <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Per-Pixel Breakdown</h4>
                      <div className="space-y-3">
                        {pixelPerf.byPixel.map((p: any) => (
                          <div key={p.pixelId} className="flex items-center justify-between p-4 rounded-xl bg-[#ffffff] border-2 border-gray-900 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                            <span className="font-bold text-gray-900 text-base">{p.name || 'Unknown Pixel'}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-green-600 font-bold font-mono">✓ {p.fired}</span>
                              {p.failed > 0 && <span className="text-red-600 font-bold font-mono">✗ {p.failed}</span>}
                              <span className={`px-3 py-1 rounded border-2 font-black text-sm ${p.fireRate >= 95 ? 'bg-green-100 text-green-800 border-green-200' :
                                p.fireRate >= 80 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                {p.fireRate}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              {!pixelPerfLoading && !pixelPerf && (
                <div className="h-[250px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-bold text-gray-900 uppercase">No pixel data</p>
                    <p className="text-sm mt-2 text-gray-500 font-medium">Fire pixels by sharing your links.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-8">
              <Globe className="w-5 h-5 text-blue-600" />
              Global Reach
            </h3>
            {(analyticsData?.locationData || []).length > 0 ? (
              <div className="space-y-4">
                {(analyticsData?.locationData || []).map((location: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-3 w-1/3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="font-bold text-gray-900 truncate">{location.country}</p>
                    </div>
                    <div className="flex items-center space-x-4 w-2/3 justify-end">
                      <div className="w-full max-w-[200px] h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="bg-gray-900 h-full rounded-full"
                          style={{ width: `${analyticsData?.totalClicks ? Math.min((location.count / analyticsData.totalClicks) * 100, 100) : 0}%` }}
                        />
                      </div>
                      <p className="font-black text-gray-900 font-mono w-16 text-right">{location.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-bold text-gray-900 uppercase">No location data</p>
                  <p className="text-sm mt-2 font-medium text-gray-500">Wait for clicks to map your audience.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSection;