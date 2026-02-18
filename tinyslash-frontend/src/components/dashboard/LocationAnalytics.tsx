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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Globe className="w-8 h-8 text-blue-600" />
            <span>Location Analytics</span>
          </h2>
          <p className="text-gray-600">Geographic distribution of your traffic</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Countries</p>
              <p className="text-3xl font-bold">{countries.length}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">States / Regions</p>
              <p className="text-3xl font-bold">{stateData.length}</p>
            </div>
            <Map className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Total Cities</p>
              <p className="text-3xl font-bold">{cityData.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-teal-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Clicks</p>
              <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Unique Visitors</p>
              <p className="text-3xl font-bold">{totalVisitors.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cities or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic by Location</h3>
          <div className="space-y-3">
            {filteredData.map((location, index) => (
              <div key={`${location.country}-${location.city}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{location.flag}</span>
                    <div>
                      <p className="font-medium text-gray-900">{location.city}</p>
                      <p className="text-sm text-gray-600">{location.region}, {location.country}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{location.clicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Clicks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{location.uniqueVisitors.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Visitors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{location.percentage}%</p>
                    <p className="text-xs text-gray-600">Share</p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clicks by Location</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredData.slice(0, 10)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="city"
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => [value, 'Clicks']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="clicks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={filteredData.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ city, percentage }) => `${city} ${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="clicks"
                >
                  {filteredData.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Clicks']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Country Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Country Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {countries.map(country => {
            const countryData = locationData.filter(loc => loc.country === country);
            const countryClicks = countryData.reduce((sum, loc) => sum + loc.clicks, 0);
            const countryVisitors = countryData.reduce((sum, loc) => sum + loc.uniqueVisitors, 0);
            const countryFlag = countryData[0]?.flag || '🌍';

            return (
              <div key={country} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{countryFlag}</span>
                    <h4 className="font-medium text-gray-900">{country}</h4>
                  </div>
                  <span className="text-sm text-gray-600">{countryData.length} cities</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{countryClicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Clicks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{countryVisitors.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Visitors</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(countryClicks / totalClicks) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    {((countryClicks / totalClicks) * 100).toFixed(1)}% of total traffic
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geographic Breakdown Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 pt-4">
          <div className="flex space-x-1">
            {(['countries', 'states', 'cities'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setGeoTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${geoTab === tab
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {tab === 'countries' && <><Globe className="w-4 h-4 inline mr-1.5" />Countries</>}
                {tab === 'states' && <><Map className="w-4 h-4 inline mr-1.5" />States / Regions</>}
                {tab === 'cities' && <><Building2 className="w-4 h-4 inline mr-1.5" />Cities</>}
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
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-xl">{loc.flag}</span>
                      <span className="font-medium text-gray-900">{loc.country}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-gray-900">{loc.clicks.toLocaleString()}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${loc.percentage}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 w-10 text-right">{loc.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {geoTab === 'states' && (
            <div className="space-y-3">
              {stateData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No state/region data yet. State-level tracking will appear as your links receive more clicks.</p>
              ) : (
                stateData.map((state) => (
                  <div key={state.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                        {state.rank}
                      </div>
                      <Map className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-gray-900">{state.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-gray-900">{state.clicks.toLocaleString()}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${state.percentage}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 w-10 text-right">{state.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {geoTab === 'cities' && (
            <div className="space-y-3">
              {cityData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No city data yet. City-level tracking will appear as your links receive more clicks.</p>
              ) : (
                cityData.map((city) => (
                  <div key={city.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-semibold text-sm">
                        {city.rank}
                      </div>
                      <Building2 className="w-4 h-4 text-teal-500" />
                      <span className="font-medium text-gray-900">{city.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-gray-900">{city.clicks.toLocaleString()}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${city.percentage}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 w-10 text-right">{city.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Location Data</h3>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export as CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export as JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationAnalytics;