import React, { useState } from 'react';
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
  Target
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LocationAnalytics from './LocationAnalytics';

const AnalyticsSection: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'location' | 'performance'>('overview');

  // Use React Query for fast loading with caching
  const { stats, isLoading, isRefreshing, hasData, error, refetch } = useDashboardData();

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">
            Comprehensive insights into your link performance
            {isRefreshing && <span className="text-blue-600 ml-2">(Refreshing...)</span>}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'location'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Globe className="w-4 h-4" />
            <span>Location Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'performance'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Performance</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'location' && (
        <LocationAnalytics timeRange={timeRange} />
      )}

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Clicks</p>
                  <p className="text-3xl font-bold">{analyticsData?.totalClicks?.toLocaleString() || 0}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Unique Visitors</p>
                  <p className="text-3xl font-bold">{analyticsData?.uniqueVisitors?.toLocaleString() || 0}</p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Links</p>
                  <p className="text-3xl font-bold">{analyticsData?.totalLinks || 0}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Avg. Daily Clicks</p>
                  <p className="text-3xl font-bold">{analyticsData?.avgClicksPerDay || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clicks Over Time */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clicks Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData?.clicksOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Clicks"
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Visitors"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Device Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Analytics Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h4>
              <p className="text-gray-600">Detailed analytics with real data integration</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Browser Usage */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Usage</h3>
            {(analyticsData?.browserData || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData?.browserData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="browser" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No browser data yet. Analytics appear after links get clicked.</p>
                </div>
              </div>
            )}
          </div>

          {/* Campaign Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
              </div>
            </div>
            <div className="p-6">
              {(stats?.campaignDetails || []).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">Campaign</th>
                        <th className="text-right py-3 px-2 text-gray-500 font-medium">Clicks</th>
                        <th className="text-right py-3 px-2 text-gray-500 font-medium">Links</th>
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">Platform</th>
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.campaignDetails.map((campaign: any, index: number) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <Target className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="font-medium text-gray-900">{campaign.campaign}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="font-semibold text-gray-900">{campaign.totalClicks.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-2 text-right text-gray-600">{campaign.totalLinks}</td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {campaign.source || '—'}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                              {campaign.medium || '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-600 mb-1">No campaigns yet</p>
                    <p className="text-sm text-gray-400">Add Campaign Tracking when creating a link to see performance here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
            {(analyticsData?.locationData || []).length > 0 ? (
              <div className="space-y-3">
                {(analyticsData?.locationData || []).map((location: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{location.country}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="font-semibold text-gray-900">{location.count}</p>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${analyticsData?.totalClicks ? Math.min((location.count / analyticsData.totalClicks) * 100, 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No location data yet. Analytics appear after links get clicked.</p>
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