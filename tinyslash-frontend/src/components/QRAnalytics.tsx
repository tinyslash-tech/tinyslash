import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { ThreeDotsLoader } from './ui/ThreeDotsLoader';

interface QRAnalyticsProps {
  qrCodeId: string;
  qrTitle: string;
  totalScans: number;
  onClose: () => void;
}

interface AnalyticsData {
  scansOverTime: Array<{ date: string; scans: number; uniqueScans: number }>;
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  locationData: Array<{ country: string; city: string; count: number }>;
  browserData: Array<{ browser: string; count: number }>;
  hourlyData: Array<{ hour: number; scans: number }>;
  referrerData: Array<{ source: string; count: number }>;
  uniqueScans: number;
}

const QRAnalytics: React.FC<QRAnalyticsProps> = ({
  qrCodeId,
  qrTitle,
  totalScans,
  onClose
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadRealAnalytics();
  }, [qrCodeId, timeRange]);

  const loadRealAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
      const response = await fetch(`${apiUrl}/v1/qr/${qrCodeId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const qrData = result.data;
        const realTotalScans = qrData.totalScans || totalScans || 0;
        const realUniqueScans = qrData.uniqueScans || 0;

        // Build scans over time from scansByDay
        let scansOverTime: any[] = [];
        const scansByDay = qrData.scansByDay;
        if (scansByDay && typeof scansByDay === 'object' && Object.keys(scansByDay).length > 0) {
          const sortedDays = Object.entries(scansByDay).sort(([a], [b]) => a.localeCompare(b));
          scansOverTime = sortedDays.map(([dateStr, scans]) => ({
            date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            scans: Number(scans),
            uniqueScans: Math.floor(Number(scans) * (realUniqueScans > 0 ? realUniqueScans / Math.max(realTotalScans, 1) : 0.75))
          }));
        }

        // Build device breakdown from scansByDevice
        let deviceBreakdown: any[] = [];
        const scansByDevice = qrData.scansByDevice;
        if (scansByDevice && typeof scansByDevice === 'object' && Object.keys(scansByDevice).length > 0) {
          const total = Object.values(scansByDevice).reduce((sum: number, v: any) => sum + Number(v), 0);
          deviceBreakdown = Object.entries(scansByDevice)
            .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
            .map(([device, count]) => ({
              device: device || 'Unknown',
              count: Number(count),
              percentage: total > 0 ? Math.round((Number(count) / total) * 100) : 0
            }));
        }

        // Build location data from scansByCity or scansByCountry
        let locationData: any[] = [];
        const scansByCity = qrData.scansByCity;
        const scansByCountry = qrData.scansByCountry;
        if (scansByCity && typeof scansByCity === 'object' && Object.keys(scansByCity).length > 0) {
          locationData = Object.entries(scansByCity)
            .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
            .slice(0, 10)
            .map(([city, count]) => ({ country: '', city: city || 'Unknown', count: Number(count) }));
        } else if (scansByCountry && typeof scansByCountry === 'object' && Object.keys(scansByCountry).length > 0) {
          locationData = Object.entries(scansByCountry)
            .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
            .slice(0, 10)
            .map(([country, count]) => ({ country: country || 'Unknown', city: '', count: Number(count) }));
        }

        // Build browser data from scansByBrowser
        let browserData: any[] = [];
        const scansByBrowser = qrData.scansByBrowser;
        if (scansByBrowser && typeof scansByBrowser === 'object' && Object.keys(scansByBrowser).length > 0) {
          browserData = Object.entries(scansByBrowser)
            .sort(([, a]: any, [, b]: any) => Number(b) - Number(a))
            .map(([browser, count]) => ({ browser: browser || 'Unknown', count: Number(count) }));
        }

        // Build hourly data from scansByHour
        let hourlyData: any[] = [];
        const scansByHour = qrData.scansByHour;
        if (scansByHour && typeof scansByHour === 'object' && Object.keys(scansByHour).length > 0) {
          hourlyData = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            scans: Number(scansByHour[String(hour)] || 0)
          }));
        }

        // Build referrer data (QR scans usually don't have referrers, but check)
        let referrerData: any[] = [];
        // No specific referrer field for QR, so we skip mock data

        setAnalyticsData({
          scansOverTime,
          deviceBreakdown,
          locationData,
          browserData,
          hourlyData,
          referrerData,
          uniqueScans: realUniqueScans
        });
      } else {
        setError('Could not load QR analytics data');
      }
    } catch (err) {
      console.error('Failed to load QR analytics:', err);
      setError('Failed to load analytics data');
      toast.error('Failed to load QR analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center justify-center text-center">
            <ThreeDotsLoader size="lg" color="bg-blue-600" className="mb-5" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Analytics</h3>
            <p className="text-gray-600">Fetching real-time QR code performance...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex space-x-3 justify-center">
            <button onClick={loadRealAnalytics} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Try Again
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const realUniqueScans = analyticsData.uniqueScans || 0;
  const hasNoData = totalScans === 0 && analyticsData.deviceBreakdown.length === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{qrTitle} - Analytics</h2>
              <p className="text-gray-600">Real-time performance insights for your QR code</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Scans</p>
                  <p className="text-3xl font-bold">{totalScans.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Unique Visitors</p>
                  <p className="text-3xl font-bold">{realUniqueScans.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg. Daily Scans</p>
                  <p className="text-3xl font-bold">
                    {analyticsData.scansOverTime.length > 0
                      ? Math.floor(totalScans / Math.max(analyticsData.scansOverTime.length, 1))
                      : Math.floor(totalScans / 30)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Peak Hour</p>
                  <p className="text-3xl font-bold">
                    {analyticsData.hourlyData.length > 0
                      ? `${analyticsData.hourlyData.reduce((max, curr) =>
                        curr.scans > max.scans ? curr : max
                      ).hour}:00`
                      : 'N/A'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          {hasNoData && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No scan data yet</h3>
              <p className="text-gray-600">Analytics will appear here once your QR code gets scanned.</p>
            </div>
          )}

          {/* Scans Over Time */}
          {analyticsData.scansOverTime.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.scansOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="scans"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Total Scans"
                  />
                  <Area
                    type="monotone"
                    dataKey="uniqueScans"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Unique Scans"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Device Breakdown */}
            {analyticsData.deviceBreakdown.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Device Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, percentage }) => `${device} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Browser Data */}
            {analyticsData.browserData.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Usage</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.browserData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="browser" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Hourly Activity */}
          {analyticsData.hourlyData.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Hourly Activity Pattern
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analyticsData.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(hour) => `${hour}:00`}
                    formatter={(value) => [value, 'Scans']}
                  />
                  <Line
                    type="monotone"
                    dataKey="scans"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Geographic Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {analyticsData.locationData.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Top Locations
                </h3>
                <div className="space-y-3">
                  {analyticsData.locationData.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{location.city || location.country}</p>
                          {location.city && location.country && (
                            <p className="text-sm text-gray-600">{location.country}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{location.count}</p>
                        <p className="text-sm text-gray-600">
                          {totalScans > 0 ? ((location.count / totalScans) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Referrer Sources */}
            {analyticsData.referrerData.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Traffic Sources
                </h3>
                <div className="space-y-3">
                  {analyticsData.referrerData.map((referrer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900">{referrer.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{referrer.count}</p>
                        <p className="text-sm text-gray-600">
                          {totalScans > 0 ? ((referrer.count / totalScans) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAnalytics;