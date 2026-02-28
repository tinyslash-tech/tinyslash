import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Eye,
  Globe,
  Smartphone,
  Calendar,
  Share2,
  Copy,
  ExternalLink,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  MousePointer,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import PixelFireStats from '../components/dashboard/CreateSection/ui/PixelFireStats';
import AiInsightsPanel from '../components/dashboard/AiInsightsPanel';

interface LinkAnalytics {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  totalClicks: number;
  uniqueVisitors: number;
  createdAt: string;
  clicksOverTime: any[];
  deviceData: any[];
  locationData: any[];
  referrerData: any[];
  hourlyData: any[];
  utmSourceData?: any[];
  utmMediumData?: any[];
  utmCampaignData?: any[];
}

const Analytics: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (!shortCode) {
      navigate('/dashboard');
      return;
    }

    loadAnalytics();
  }, [shortCode, timeRange, searchParams]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Loading analytics for shortCode:', shortCode);

      // Get userId from URL params or user context
      const userId = searchParams.get('userId') || user?.id;
      console.log('📊 Analytics userId:', userId);

      if (!userId) {
        console.error('❌ No userId found');
        toast.error('User ID not found');
        navigate('/dashboard');
        return;
      }

      // Load analytics from the backend
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
      const token = localStorage.getItem('token');

      // Use the new secure endpoint
      const analyticsUrl = `${apiUrl}/v1/analytics/links/${shortCode}`;

      console.log('🌐 Making analytics API call to:', analyticsUrl);

      const response = await fetch(analyticsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Analytics API response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;

        try {
          const errorResult = await response.json();
          errorMessage = errorResult.message || errorResult.error || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use the status text
          errorMessage = response.statusText || errorMessage;
        }

        console.error('❌ Analytics API HTTP error:', response.status, errorMessage);

        if (response.status === 403) {
          throw new Error('FORBIDDEN_ACCESS');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 404) {
          throw new Error('LINK_NOT_FOUND');
        } else {
          throw new Error(errorMessage);
        }
      }

      const result = await response.json();
      console.log('📊 Analytics API result:', result);

      if (!result.success) {
        console.error('❌ Analytics API failed:', result.message);
        throw new Error(result.message || 'Failed to load analytics');
      }

      const analyticsData = result.data;
      console.log('✅ Analytics data received:', analyticsData);

      // Transform backend data to frontend format
      const totalClicks = analyticsData.totalClicks || 0;
      const uniqueClicks = analyticsData.uniqueClicks || 0;
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

      // Build clicks over time from real clicksByDay data
      let clicksOverTime: any[] = [];
      const clicksByDay = analyticsData.clicksByDay || analyticsData.last7DaysClicks;
      if (clicksByDay && typeof clicksByDay === 'object' && Object.keys(clicksByDay).length > 0) {
        // Backend returns { "2026-02-15": 12, "2026-02-16": 8, ... }
        const sortedDays = Object.entries(clicksByDay).sort(([a], [b]) => a.localeCompare(b));
        clicksOverTime = sortedDays.map(([dateStr, clicks]) => ({
          date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          clicks: Number(clicks),
          visitors: Math.floor(Number(clicks) * (uniqueClicks > 0 ? uniqueClicks / Math.max(totalClicks, 1) : 0.75))
        }));
      }
      // If no real data, generate empty chart for the selected range
      if (clicksOverTime.length === 0) {
        clicksOverTime = Array.from({ length: Math.min(days, 7) }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (Math.min(days, 7) - 1 - i));
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            clicks: 0,
            visitors: 0
          };
        });
      }

      // Build device data from real clicksByDevice
      let deviceData: any[] = [];
      const clicksByDevice = analyticsData.clicksByDevice;
      if (clicksByDevice && typeof clicksByDevice === 'object' && Object.keys(clicksByDevice).length > 0) {
        const total = Object.values(clicksByDevice).reduce((sum: number, v: any) => sum + Number(v), 0);
        deviceData = Object.entries(clicksByDevice)
          .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
          .map(([device, count]) => ({
            device: device || 'Unknown',
            count: Number(count),
            percentage: total > 0 ? Math.round((Number(count) / total) * 100) : 0
          }));
      }

      // Build location data from real clicksByCountry + clicksByRegion + clicksByCity
      let locationData: any[] = [];
      const clicksByCity = analyticsData.clicksByCity;
      const clicksByRegion = analyticsData.clicksByRegion;
      const clicksByCountry = analyticsData.clicksByCountry;

      // Priority: city > region > country (show most granular available)
      if (clicksByCity && typeof clicksByCity === 'object' && Object.keys(clicksByCity).length > 0) {
        locationData = Object.entries(clicksByCity)
          .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
          .slice(0, 10)
          .map(([city, count]) => ({
            country: '',
            region: '',
            city: city || 'Unknown',
            count: Number(count),
            type: 'city'
          }));
      } else if (clicksByRegion && typeof clicksByRegion === 'object' && Object.keys(clicksByRegion).length > 0) {
        locationData = Object.entries(clicksByRegion)
          .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
          .slice(0, 10)
          .map(([region, count]) => ({
            country: '',
            region: region || 'Unknown',
            city: '',
            count: Number(count),
            type: 'state'
          }));
      } else if (clicksByCountry && typeof clicksByCountry === 'object' && Object.keys(clicksByCountry).length > 0) {
        locationData = Object.entries(clicksByCountry)
          .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
          .slice(0, 10)
          .map(([country, count]) => ({
            country: country || 'Unknown',
            region: '',
            city: '',
            count: Number(count),
            type: 'country'
          }));
      }

      // Build referrer data from real clicksByReferrer
      let referrerData: any[] = [];
      const clicksByReferrer = analyticsData.clicksByReferrer;
      if (clicksByReferrer && typeof clicksByReferrer === 'object' && Object.keys(clicksByReferrer).length > 0) {
        referrerData = Object.entries(clicksByReferrer)
          .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
          .slice(0, 10)
          .map(([source, count]) => ({
            source: source || 'Direct',
            count: Number(count)
          }));
      }

      // Build UTM Data
      const formatUtmData = (data: any) => {
        if (!data || typeof data !== 'object') return [];
        return Object.entries(data)
          .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
          .slice(0, 5)
          .map(([name, count]) => ({ name: name || '(none)', count: Number(count) }));
      };

      const utmSourceData = formatUtmData(analyticsData.clicksByUtmSource);
      const utmMediumData = formatUtmData(analyticsData.clicksByUtmMedium);
      const utmCampaignData = formatUtmData(analyticsData.clicksByUtmCampaign);

      // Build hourly data from real clicksByHour
      let hourlyData: any[] = [];
      const clicksByHour = analyticsData.clicksByHour;
      if (clicksByHour && typeof clicksByHour === 'object' && Object.keys(clicksByHour).length > 0) {
        hourlyData = Array.from({ length: 24 }, (_, hour) => ({
          hour,
          clicks: Number(clicksByHour[String(hour)] || 0)
        }));
      }

      const analyticsObject = {
        shortCode: shortCode!,
        originalUrl: analyticsData.originalUrl || `https://tinyslash.com/${shortCode}`,
        shortUrl: analyticsData.shortUrl || `https://tinyslash.com/${shortCode}`,
        totalClicks,
        uniqueVisitors: uniqueClicks,
        createdAt: analyticsData.createdAt || new Date().toISOString(),
        clicksOverTime,
        deviceData,
        locationData,
        referrerData,
        hourlyData,
        utmSourceData,
        utmMediumData,
        utmCampaignData
      };

      console.log('📈 Setting analytics object:', analyticsObject);
      setAnalytics(analyticsObject);
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Failed to load analytics: ${errorMessage}`);

      // Set a fallback analytics object to prevent white screen
      setAnalytics({
        shortCode: shortCode!,
        originalUrl: `https://example.com/${shortCode}`,
        shortUrl: `https://tinyslash.com/${shortCode}`,
        totalClicks: 0,
        uniqueVisitors: 0,
        createdAt: new Date().toISOString(),
        clicksOverTime: [
          { date: 'Today', clicks: 0, visitors: 0 }
        ],
        deviceData: [
          { device: 'No Data', count: 0, percentage: 0 }
        ],
        locationData: [
          { country: 'No Data', city: 'No Data', count: 0 }
        ],
        referrerData: [
          { source: 'No Data', count: 0 }
        ],
        hourlyData: [
          { hour: 0, clicks: 0 }
        ]
      });
    } finally {
      setLoading(false);
      console.log('✅ Analytics loading completed');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    let errorTitle = "Analytics Error";
    let errorDesc = "Failed to load analytics for this link.";
    let showTryAgain = true;

    if (error === 'FORBIDDEN_ACCESS') {
      errorTitle = "Access Forbidden";
      errorDesc = "You generally do not have permission to view this link's analytics. It belongs to another user.";
      showTryAgain = false;
    } else if (error === 'LINK_NOT_FOUND') {
      errorTitle = "Link Not Found";
      errorDesc = "The link you are looking for does not exist or has been deleted.";
      showTryAgain = false;
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">{errorTitle}</h2>
            <p className="text-gray-600 mb-2">{errorDesc}</p>
            {showTryAgain && <p className="text-sm text-red-500 mb-6">{error}</p>}
            <div className="space-x-4 mt-6">
              {showTryAgain && (
                <button
                  onClick={() => {
                    setError(null);
                    loadAnalytics();
                  }}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Not Found</h2>
            <p className="text-gray-600 mb-6">The requested link analytics could not be found.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-900 font-bold hover:-translate-y-0.5 transition-all mb-4 px-3 py-1.5 bg-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-lg w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <span className="bg-yellow-100 text-yellow-800 p-2 rounded-lg border-2 border-yellow-200">
                    <MousePointer className="w-6 h-6" />
                  </span>
                  Link Analytics
                </h1>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center space-x-3">
                    <p className="font-mono text-blue-600 text-lg font-bold bg-blue-50 px-3 py-1 rounded border-2 border-blue-200">{analytics.shortUrl}</p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(analytics.shortUrl)}
                        className="p-2 bg-gray-50 border-2 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-900 rounded-lg transition-all hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(analytics.shortUrl, '_blank')}
                        className="p-2 bg-gray-50 border-2 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-900 rounded-lg transition-all hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-500 truncate max-w-md block">
                    {analytics.originalUrl}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end space-y-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-4 py-2.5 bg-white border-2 border-gray-900 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[position:right_16px_center] bg-no-repeat pr-10"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Created {new Date(analytics.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights specific for individual links */}
          <div className="mb-8">
            <AiInsightsPanel context="link" stats={analytics} isLoading={loading} />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <div className="bg-[#ffffff] rounded-xl p-5 sm:p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <MousePointer className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Clicks</p>
              <p className="text-3xl sm:text-4xl font-black font-mono text-gray-900">{analytics.totalClicks.toLocaleString()}</p>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-5 sm:p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Unique Vstrs</p>
              <p className="text-3xl sm:text-4xl font-black font-mono text-gray-900">{analytics.uniqueVisitors.toLocaleString()}</p>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-5 sm:p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 border-2 border-purple-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Click Rate</p>
              <p className="text-3xl sm:text-4xl font-black font-mono text-purple-600">
                {analytics.totalClicks > 0 ? ((analytics.uniqueVisitors / analytics.totalClicks) * 100).toFixed(1) : 0}%
              </p>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-5 sm:p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Avg. Daily</p>
              <p className="text-3xl sm:text-4xl font-black font-mono text-orange-600">
                {Math.floor(analytics.totalClicks / Math.max(analytics.clicksOverTime.length, 1))}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Clicks Over Time */}
            <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Clicks Over Time</h3>
              {analytics.clicksOverTime && analytics.clicksOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.clicksOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#111827" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '2px solid #111827', boxShadow: '4px 4px 0px rgba(0,0,0,1)', padding: '12px', fontWeight: 'bold' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '12px' }} />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="#111827"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorClicks)"
                      name="Clicks"
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorVisitors)"
                      name="Unique Visitors"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 font-bold border-2 border-dashed border-gray-300 rounded-lg">
                  No click data available
                </div>
              )}
            </div>

            {/* Device Breakdown */}
            <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Device Breakdown</h3>
              {analytics.deviceData && analytics.deviceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, percentage }) => `${device} ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      stroke="#111827"
                      strokeWidth={2}
                    >
                      {analytics.deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '2px solid #111827', boxShadow: '4px 4px 0px rgba(0,0,0,1)', padding: '12px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 font-bold border-2 border-dashed border-gray-300 rounded-lg">
                  No device data available
                </div>
              )}
            </div>
          </div>

          {/* UTM Analytics */}
          <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-8">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Campaign Performance (UTM)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* UTM Source */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b-2 border-gray-100 pb-2">Top Sources</h4>
                {analytics.utmSourceData && analytics.utmSourceData.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.utmSourceData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm group">
                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</span>
                        <span className="font-black font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">{item.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-400 italic">No source data</p>
                )}
              </div>

              {/* UTM Medium */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b-2 border-gray-100 pb-2">Top Mediums</h4>
                {analytics.utmMediumData && analytics.utmMediumData.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.utmMediumData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm group">
                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</span>
                        <span className="font-black font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">{item.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-400 italic">No medium data</p>
                )}
              </div>

              {/* UTM Campaign */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b-2 border-gray-100 pb-2">Top Campaigns</h4>
                {analytics.utmCampaignData && analytics.utmCampaignData.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.utmCampaignData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm group">
                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</span>
                        <span className="font-black font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">{item.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-400 italic">No campaign data</p>
                )}
              </div>
            </div>
          </div>

          {/* Location and Referrer Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Locations */}
            <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Top Locations</h3>
              <div className="space-y-4">
                {analytics.locationData.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 group hover:border-gray-900 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border-2 border-blue-200 group-hover:bg-blue-100 transition-colors">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg leading-tight">
                          {location.city || location.region || location.country || 'Unknown'}
                        </p>
                        {location.type === 'city' && location.country && (
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{location.country}</p>
                        )}
                        {location.type === 'state' && (
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">State / Region</p>
                        )}
                        {location.type === 'country' && (
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black font-mono text-gray-900 text-xl">{location.count}</p>
                      <p className="text-xs font-bold font-mono text-gray-500">
                        {analytics.totalClicks > 0 ? ((location.count / analytics.totalClicks) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Traffic Sources</h3>
              <div className="space-y-4">
                {analytics.referrerData.map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 group hover:border-gray-900 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border-2 border-green-200 group-hover:bg-green-100 transition-colors">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="font-bold text-gray-900 text-lg">{referrer.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black font-mono text-gray-900 text-xl">{referrer.count}</p>
                      <p className="text-xs font-bold font-mono text-gray-500">
                        {analytics.totalClicks > 0 ? ((referrer.count / analytics.totalClicks) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hourly Distribution */}
          <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all mb-8">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Hourly Click Distribution</h3>
            {analytics.hourlyData && analytics.hourlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                    tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: '2px solid #111827', boxShadow: '4px 4px 0px rgba(0,0,0,1)', padding: '12px', fontWeight: 'bold' }}
                    labelFormatter={(hour) => `${hour}:00 - ${hour + 1}:00`}
                  />
                  <Bar dataKey="clicks" fill="#111827" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 font-bold border-2 border-dashed border-gray-300 rounded-lg">
                No hourly data available
              </div>
            )}
          </div>

          {/* Pixel Analytics (SaaS-grade) */}
          <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 border-2 border-indigo-200 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Retargeting Pixel Analytics</h3>
              </div>
              <span className="sm:ml-auto text-xs bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg font-black border-2 border-indigo-200 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] w-fit">SaaS Specific</span>
            </div>
            {/* Embedded stats */}
            <div className="mt-4">
              <PixelFireStats
                linkId={analytics.shortCode}
                userId={searchParams.get('userId') || user?.id || ''}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (renderError) {
    console.error('❌ Render error in Analytics component:', renderError);
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Render Error</h2>
            <p className="text-gray-600 mb-6">Something went wrong while displaying the analytics.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Analytics;