import React from 'react';
import { Page } from '../../../types/page';
import { useQuery } from '@tanstack/react-query';
import { pageService } from '../../../services/pageService';
import { BarChart3, Users, Mail, Calendar, Download, RefreshCw, Globe, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnalyticsTabProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ page }) => {
  const [view, setView] = React.useState<'OVERVIEW' | 'LEADS'>('OVERVIEW');

  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['page-analytics', page.id],
    queryFn: () => pageService.getAnalytics(page.id),
    enabled: !!page.id
  });

  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['page-leads', page.id],
    queryFn: () => pageService.getLeads(page.userId, page.id),
    enabled: !!page.id
  });

  const downloadCsv = () => {
    if (!leads || leads.length === 0) return;

    const headers = ['Date', 'Type', 'Email', 'Source', 'IP', 'Country'];
    const rows = leads.map((lead: any) => [
      new Date(lead.createdAt).toISOString().replace('T', ' ').substring(0, 16),
      lead.leadType,
      lead.email || '-',
      lead.source,
      lead.ip,
      lead.country
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map((e: any[]) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.setAttribute("download", `leads_${page.slug}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate week-over-week change percentage
  const getChangePercent = (thisWeek: number, lastWeek: number) => {
    if (lastWeek === 0 && thisWeek === 0) return { value: 0, label: 'No change' };
    if (lastWeek === 0) return { value: 100, label: '+100%' };
    const change = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    return { value: change, label: `${change >= 0 ? '+' : ''}${change}%` };
  };

  return (
    <div className="space-y-6 h-full flex flex-col">

      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-100 rounded-lg self-start">
        <button
          onClick={() => setView('OVERVIEW')}
          className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${view === 'OVERVIEW' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setView('LEADS')}
          className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${view === 'LEADS' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Leads & Form
        </button>
      </div>

      {view === 'OVERVIEW' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

          {analyticsLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading analytics...</div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Total Views */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Total Views</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{analytics?.totalViews ?? 0}</p>
                  {analytics && (() => {
                    const change = getChangePercent(analytics.thisWeekViews || 0, analytics.lastWeekViews || 0);
                    return (
                      <div className="flex items-center gap-1 mt-1">
                        {change.value > 0 ? <TrendingUp className="w-3 h-3 text-green-600" /> :
                          change.value < 0 ? <TrendingDown className="w-3 h-3 text-red-500" /> :
                            <Minus className="w-3 h-3 text-gray-400" />}
                        <span className={`text-xs font-medium ${change.value > 0 ? 'text-green-600' : change.value < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                          {change.label} from last week
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Unique Visitors */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Unique Visitors</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{analytics?.uniqueVisitors ?? 0}</p>
                  <p className="text-xs text-gray-400 mt-1">All time</p>
                </div>
              </div>

              {/* Views Chart (Pure CSS bar chart) */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-900">Views — Last 30 Days</h4>
                  <button onClick={() => refetchAnalytics()} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 ${analyticsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                {analytics?.dailyViews && (() => {
                  const entries = Object.entries(analytics.dailyViews as Record<string, number>);
                  const maxVal = Math.max(...entries.map(([, v]) => v as number), 1);
                  return (
                    <div className="flex items-end gap-[3px] h-32">
                      {entries.map(([date, count]) => {
                        const height = Math.max(((count as number) / maxVal) * 100, 2);
                        const dateObj = new Date(date + 'T00:00:00');
                        const dayLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        return (
                          <div key={date} className="flex-1 flex flex-col items-center group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                              <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                {dayLabel}: {count as number} view{(count as number) !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <div
                              className="w-full rounded-t-sm transition-all duration-200 hover:opacity-80"
                              style={{
                                height: `${height}%`,
                                backgroundColor: (count as number) > 0 ? '#3b82f6' : '#e5e7eb',
                                minHeight: '2px'
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                {!analytics?.dailyViews && (
                  <div className="h-32 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
                )}
              </div>

              {/* Top Referrers */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-4">Top Referrers</h4>
                {analytics?.topReferrers && Object.keys(analytics.topReferrers).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(analytics.topReferrers as Record<string, number>).map(([domain, count]) => {
                      const total = analytics.totalViews || 1;
                      const pct = Math.round(((count as number) / total) * 100);
                      return (
                        <div key={domain}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center gap-2">
                              <Globe className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-medium text-gray-700">{domain}</span>
                            </div>
                            <span className="text-gray-500 text-xs">{count as number} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6">
                    <Globe className="w-6 h-6 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">No referrer data yet</p>
                    <p className="text-xs text-gray-300 mt-0.5">Share your page link to start tracking sources</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {view === 'LEADS' && (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Form Submissions</h3>
              <p className="text-xs text-gray-500">Collected from your page forms</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => refetchLeads()} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <RefreshCw className={`w-4 h-4 ${leadsLoading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={downloadCsv} disabled={!leads || leads.length === 0} className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50">
                <Download className="w-3 h-3" /> Export CSV
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Date</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Type</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Email / Contact</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leadsLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td>
                    </tr>
                  ) : leads?.length > 0 ? (
                    leads.map((lead: any) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {new Date(lead.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            {lead.leadType}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {lead.email || lead.whatsapp || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {lead.country} {lead.ip ? `(${lead.ip})` : ''}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <Mail className="w-8 h-8 text-gray-300 mb-2" />
                          <p className="text-gray-500 font-medium">No leads collected yet</p>
                          <p className="text-xs text-gray-400 max-w-xs mt-1">Add a Form or Email Signup block to your page to start collecting leads.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
