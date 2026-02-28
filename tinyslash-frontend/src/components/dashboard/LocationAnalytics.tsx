import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import {
  MapPin,
  Globe,
  Users,
  Eye,
  RefreshCw,
  Download,
  Search,
  Building2,
  Map
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import WorldMapWidget from './WorldMapWidget';

interface LocationData {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  clicks: number;
  uniqueVisitors: number;
  percentage: number;
  flag: string;
}

interface LocationAnalyticsProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

// Country code to flag emoji mapping
const COUNTRY_FLAGS: Record<string, string> = {
  'India': '🇮🇳', 'United States': '🇺🇸', 'USA': '🇺🇸', 'United Kingdom': '🇬🇧', 'UK': '🇬🇧',
  'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Germany': '🇩🇪', 'France': '🇫🇷', 'Japan': '🇯🇵',
  'Singapore': '🇸🇬', 'Brazil': '🇧🇷', 'China': '🇨🇳', 'Russia': '🇷🇺', 'South Korea': '🇰🇷',
  'Netherlands': '🇳🇱', 'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Mexico': '🇲🇽', 'Indonesia': '🇮🇩',
};

const LocationAnalytics: React.FC<LocationAnalyticsProps> = ({ timeRange = '30d' }) => {
  const { user } = useAuth();
  const { stats, isLoading, refetch } = useDashboardData();
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'chart'>('list');
  const [geoTab, setGeoTab] = useState<'countries' | 'states' | 'cities'>('countries');

  useEffect(() => {
    if (stats && !isLoading) {
      buildLocationData();
    }
  }, [stats, isLoading]);

  const buildLocationData = () => {
    if (!stats) return;

    const clicksByCountry = stats.clicksByCountry || {};
    const totalClicks = Object.values(clicksByCountry).reduce((sum, v) => sum + v, 0);

    if (Object.keys(clicksByCountry).length === 0) {
      setLocationData([]);
      setLoading(false);
      return;
    }

    // Build real location data from backend aggregated analytics
    const realLocationData: LocationData[] = Object.entries(clicksByCountry)
      .sort(([, a], [, b]) => b - a)
      .map(([country, clicks]) => ({
        country: country || 'Unknown',
        countryCode: '',
        city: '',
        region: '',
        latitude: 0,
        longitude: 0,
        clicks,
        uniqueVisitors: Math.floor(clicks * 0.8),
        percentage: totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0,
        flag: COUNTRY_FLAGS[country] || '🌍'
      }));

    setLocationData(realLocationData);
    setLoading(false);
  };

  const filteredData = locationData.filter(location => {
    const matchesCountry = selectedCountry === 'all' || location.country === selectedCountry;
    const matchesSearch = searchTerm === '' ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const countries = Array.from(new Set(locationData.map(loc => loc.country)));
  const totalClicks = locationData.reduce((sum, loc) => sum + loc.clicks, 0);
  const totalVisitors = locationData.reduce((sum, loc) => sum + loc.uniqueVisitors, 0);

  // Build state/region data from backend
  const stateData = React.useMemo(() => {
    const clicksByRegion = stats?.clicksByRegion || {};
    const total = Object.values(clicksByRegion).reduce((sum, v) => sum + v, 0);
    return Object.entries(clicksByRegion)
      .sort(([, a], [, b]) => b - a)
      .map(([region, clicks], index) => ({
        rank: index + 1,
        name: region,
        clicks,
        percentage: total > 0 ? Math.round((clicks / total) * 100) : 0
      }));
  }, [stats?.clicksByRegion]);

  // Build city data from backend
  const cityData = React.useMemo(() => {
    const clicksByCity = stats?.clicksByCity || {};
    const total = Object.values(clicksByCity).reduce((sum, v) => sum + v, 0);
    return Object.entries(clicksByCity)
      .sort(([, a], [, b]) => b - a)
      .map(([city, clicks], index) => ({
        rank: index + 1,
        name: city,
        clicks,
        percentage: total > 0 ? Math.round((clicks / total) * 100) : 0
      }));
  }, [stats?.clicksByCity]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-900 border-dashed">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center space-x-3 tracking-tight">
            <Globe className="w-8 h-8 text-blue-600" />
            <span>Map Analytics</span>
          </h2>
          <p className="text-gray-600 font-medium mt-2">Geographic distribution of your traffic</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-50 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Map</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="bg-[#ffffff] rounded-xl p-5 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Countries</p>
          <p className="text-3xl font-bold font-mono text-gray-900">{countries.length}</p>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Map className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Regions</p>
          <p className="text-3xl font-bold font-mono text-gray-900">{stateData.length}</p>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-teal-50 border-2 border-teal-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Building2 className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Cities</p>
          <p className="text-3xl font-bold font-mono text-gray-900">{cityData.length}</p>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 border-2 border-purple-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Clicks</p>
          <p className="text-3xl font-bold font-mono text-gray-900">{totalClicks.toLocaleString()}</p>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Unique Vstrs</p>
          <p className="text-3xl font-bold font-mono text-gray-900">{totalVisitors.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="bg-[#ffffff] rounded-xl p-4 sm:p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-white border-2 border-gray-900 rounded-lg text-sm font-bold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:shadow-[2px_2px_0px_rgba(37,99,235,1)] transition-all min-w-[200px]"
              />
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2.5 bg-white border-2 border-gray-900 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[150px] appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[position:right_16px_center] bg-no-repeat pr-10"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${viewMode === 'map'
                ? 'bg-blue-600 text-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-900 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                }`}
            >
              Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${viewMode === 'list'
                ? 'bg-blue-600 text-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-900 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${viewMode === 'chart'
                ? 'bg-blue-600 text-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-900 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                }`}
            >
              Chart View
            </button>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'map' && (
        <WorldMapWidget />
      )}

      {viewMode === 'list' && (
        <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Traffic by Location</h3>
          <div className="space-y-4">
            {filteredData.map((location, index) => (
              <div key={`${location.country}-${location.city}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-900 transition-colors group gap-4 sm:gap-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 border-2 border-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold group-hover:bg-blue-200 transition-colors">
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl filter drop-shadow-sm">{location.flag}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-lg leading-tight">{location.city || 'Unknown City'}</p>
                      <p className="text-sm font-medium text-gray-500">{location.region || location.country}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 sm:space-x-8">
                  <div className="text-center sm:text-right">
                    <p className="text-xl font-black font-mono text-gray-900">{location.clicks.toLocaleString()}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Clicks</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xl font-black font-mono text-green-600">{location.uniqueVisitors.toLocaleString()}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Visitors</p>
                  </div>
                  <div className="text-center sm:text-right hidden md:block">
                    <p className="text-xl font-black font-mono text-blue-600">{location.percentage}%</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Share</p>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-3 border border-gray-300 overflow-hidden hidden lg:block">
                    <div
                      className="bg-gray-900 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          {/* Bar Chart */}
          <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Clicks by Location</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredData.slice(0, 10)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="city"
                  width={80}
                  tick={{ fontSize: 12, fill: '#111827', fontWeight: 'bold' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: '2px solid #111827', boxShadow: '4px 4px 0px rgba(0,0,0,1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 'bold', color: '#111827' }}
                  formatter={(value, name) => [value, 'Clicks']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="clicks" fill="#111827" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Traffic Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={filteredData.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ city, percentage }) => `${city} ${percentage}%`}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="clicks"
                  stroke="#111827"
                  strokeWidth={2}
                >
                  {filteredData.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '2px solid #111827', boxShadow: '4px 4px 0px rgba(0,0,0,1)', padding: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [value, 'Clicks']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Country Summary */}
      <div className="bg-[#ffffff] rounded-xl p-6 sm:p-8 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Country Deep Dive
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map(country => {
            const countryData = locationData.filter(loc => loc.country === country);
            const countryClicks = countryData.reduce((sum, loc) => sum + loc.clicks, 0);
            const countryVisitors = countryData.reduce((sum, loc) => sum + loc.uniqueVisitors, 0);
            const countryFlag = countryData[0]?.flag || '🌍';

            return (
              <div key={country} className="p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all group">
                <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-100 group-hover:border-gray-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl filter drop-shadow-sm">{countryFlag}</span>
                    <h4 className="font-bold text-gray-900 text-lg">{country}</h4>
                  </div>
                  <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded">{countryData.length} cities</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Clicks</p>
                    <p className="text-xl font-black font-mono text-gray-900">{countryClicks.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Visitors</p>
                    <p className="text-xl font-black font-mono text-green-600">{countryVisitors.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Traffic Share</span>
                    <span className="text-xs font-black font-mono text-blue-600">{((countryClicks / totalClicks) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300">
                    <div
                      className="bg-gray-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(countryClicks / totalClicks) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geographic Breakdown Tabs */}
      <div className="bg-[#ffffff] rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="border-b-2 border-gray-900 px-6 pt-4 bg-gray-100">
          <div className="flex space-x-2 overflow-x-auto pb-0">
            {(['countries', 'states', 'cities'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setGeoTab(tab)}
                className={`px-5 py-3 text-sm font-bold rounded-t-lg transition-all border-x-2 border-t-2 whitespace-nowrap ${geoTab === tab
                  ? 'bg-white text-gray-900 border-gray-900 relative top-[2px]'
                  : 'bg-gray-100 text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-200'
                  }`}
              >
                {tab === 'countries' && <><Globe className="w-4 h-4 inline mr-2" />Countries</>}
                {tab === 'states' && <><Map className="w-4 h-4 inline mr-2" />States / Regions</>}
                {tab === 'cities' && <><Building2 className="w-4 h-4 inline mr-2" />Cities</>}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {geoTab === 'countries' && (
            <div className="space-y-3">
              {locationData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No country data yet. Traffic data will appear as your links receive clicks.</p>
              ) : (
                locationData.map((loc, index) => (
                  <div key={loc.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 w-1/3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-2xl filter drop-shadow-sm">{loc.flag}</span>
                      <span className="font-bold text-gray-900">{loc.country}</span>
                    </div>
                    <div className="flex items-center space-x-4 w-2/3 justify-end">
                      <span className="font-black text-gray-900 font-mono text-lg">{loc.clicks.toLocaleString()}</span>
                      <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-3 border border-gray-300 overflow-hidden hidden sm:block">
                        <div className="bg-gray-900 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${loc.percentage}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-500 font-mono w-12 text-right">{loc.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {geoTab === 'states' && (
            <div className="space-y-3">
              {stateData.length === 0 ? (
                <p className="text-gray-500 text-center py-8 font-medium">No state/region data yet. State-level tracking will appear as your links receive more clicks.</p>
              ) : (
                stateData.map((state) => (
                  <div key={state.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition-colors gap-4 sm:gap-0">
                    <div className="flex items-center space-x-3 w-1/3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                        {state.rank}
                      </div>
                      <Map className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-gray-900">{state.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 w-2/3 justify-end">
                      <span className="font-black text-gray-900 font-mono text-lg">{state.clicks.toLocaleString()}</span>
                      <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-3 border border-gray-300 overflow-hidden hidden sm:block">
                        <div className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${state.percentage}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-500 font-mono w-12 text-right">{state.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {geoTab === 'cities' && (
            <div className="space-y-3">
              {cityData.length === 0 ? (
                <p className="text-gray-500 text-center py-8 font-medium">No city data yet. City-level tracking will appear as your links receive more clicks.</p>
              ) : (
                cityData.map((city) => (
                  <div key={city.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition-colors gap-4 sm:gap-0">
                    <div className="flex items-center space-x-3 w-1/3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm">
                        {city.rank}
                      </div>
                      <Building2 className="w-5 h-5 text-teal-600" />
                      <span className="font-bold text-gray-900">{city.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 w-2/3 justify-end">
                      <span className="font-black text-gray-900 font-mono text-lg">{city.clicks.toLocaleString()}</span>
                      <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-3 border border-gray-300 overflow-hidden hidden sm:block">
                        <div className="bg-teal-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${city.percentage}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-500 font-mono w-12 text-right">{city.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      {/* Export Options */}
      <div className="bg-[#ffffff] rounded-xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            Export Data
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1">Download your location analytics.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-bold hover:-translate-y-0.5">
            <Download className="w-4 h-4" />
            <span>CSV File</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-bold hover:-translate-y-0.5">
            <Download className="w-4 h-4" />
            <span>JSON Payload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationAnalytics;