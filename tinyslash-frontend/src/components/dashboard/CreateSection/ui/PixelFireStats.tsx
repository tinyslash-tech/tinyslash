import React, { useEffect, useState } from 'react';
import { PixelService, LinkPixelStats, PixelLinkStat } from '../../../../services/PixelService';
import { Activity, CheckCircle, XCircle, TrendingUp, AlertTriangle } from 'lucide-react';

interface PixelFireStatsProps {
  linkId: string;
  userId: string;
}

const platformLabel: Record<string, { icon: string; color: string }> = {
  FACEBOOK_CAPI: { icon: '📘', color: 'bg-blue-100 text-blue-700' },
  GOOGLE_ADS: { icon: '🟢', color: 'bg-green-100 text-green-700' },
  GA4: { icon: '📊', color: 'bg-orange-100 text-orange-700' },
  WEBHOOK: { icon: '🔗', color: 'bg-gray-100 text-gray-700' },
};

const FireRateBadge: React.FC<{ rate: number }> = ({ rate }) => {
  const color = rate >= 95 ? 'text-green-600 bg-green-50' : rate >= 80 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
  const icon = rate >= 95 ? '✓' : rate >= 80 ? '~' : '!';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {icon} {rate}%
    </span>
  );
};

const PixelFireStats: React.FC<PixelFireStatsProps> = ({ linkId, userId }) => {
  const [stats, setStats] = useState<LinkPixelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!linkId || !userId) return;
    setLoading(true);
    PixelService.getLinkPixelStats(linkId, userId)
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [linkId, userId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2 p-4">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-100 rounded" />
        <div className="h-10 bg-gray-100 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 p-4">
        <AlertTriangle className="w-4 h-4" />
        Could not load pixel data.
      </div>
    );
  }

  if (!stats || stats.pixels.length === 0) {
    return (
      <div className="text-sm text-gray-400 italic p-1">
        No pixels fired for this link yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary header */}
      <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          <strong className="text-gray-700">{stats.totalFired + stats.totalFailed}</strong> total events
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          <strong className="text-green-700">{stats.totalFired}</strong> captured
        </span>
        {stats.totalFailed > 0 && (
          <span className="flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            <strong className="text-red-600">{stats.totalFailed}</strong> missed
          </span>
        )}
        <span className="ml-auto flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          Fire rate: <FireRateBadge rate={stats.overallFireRate} />
        </span>
      </div>

      {/* Per-pixel rows */}
      <div className="space-y-1.5">
        {stats.pixels.map((p: PixelLinkStat) => {
          const platform = platformLabel[p.type] || { icon: '▸', color: 'bg-gray-100 text-gray-600' };
          return (
            <div key={p.pixelId} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${platform.color}`}>
                  {platform.icon} {p.type.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium text-gray-800">{p.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-green-600 font-medium">{p.fired} ✓</span>
                {p.failed > 0 && <span className="text-red-500">{p.failed} ✗</span>}
                <FireRateBadge rate={p.fireRate} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PixelFireStats;
