import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, QrCode, Upload, Clock, Eye, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUserUrls, getUserQrCodes, getUserFiles } from '../../services/api';

interface ActivityItem {
  id: string;
  type: 'url' | 'qr' | 'file';
  title: string;
  shortUrl: string;
  clicks: number;
  timestamp: string;
  isNew?: boolean;
}

interface LiveActivityFeedProps {
  maxItems?: number;
  showActions?: boolean;
  className?: string;
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  maxItems = 5,
  showActions = true,
  className = ''
}) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    if (!user?.id) return;

    try {
      const [urlsResponse, qrResponse, filesResponse] = await Promise.all([
        getUserUrls(user.id).catch(() => ({ success: false, data: [] })),
        getUserQrCodes(user.id).catch(() => ({ success: false, data: [] })),
        getUserFiles(user.id).catch(() => ({ success: false, data: [] }))
      ]);

      const links = urlsResponse.success ? urlsResponse.data : [];
      const qrCodes = qrResponse.success ? qrResponse.data : [];
      const files = filesResponse.success ? filesResponse.data : [];

      const allActivities: ActivityItem[] = [
        ...links.map((link: any) => ({
          id: link.id,
          type: 'url' as const,
          title: 'Short Link',
          shortUrl: link.shortUrl,
          clicks: link.clicks || 0,
          timestamp: link.createdAt
        })),
        ...qrCodes.map((qr: any) => ({
          id: qr.id,
          type: 'qr' as const,
          title: 'QR Code',
          shortUrl: qr.shortUrl,
          clicks: qr.scans || 0,
          timestamp: qr.createdAt
        })),
        ...files.map((file: any) => ({
          id: file.id,
          type: 'file' as const,
          title: file.originalFileName || 'File Link',
          shortUrl: file.fileUrl,
          clicks: file.totalDownloads || 0,
          timestamp: file.uploadedAt
        }))
      ];

      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, maxItems);

      // Check for new activities
      const previousIds = activities.map(a => a.id);
      const newActivities = sortedActivities.filter(a => !previousIds.includes(a.id));

      if (newActivities.length > 0 && activities.length > 0) {
        newActivities.forEach(activity => {
          toast.success(`New ${activity.type === 'url' ? 'short link' : activity.type === 'qr' ? 'QR code' : 'file'} created!`, {
            duration: 3000,
            icon: activity.type === 'url' ? '🔗' : activity.type === 'qr' ? '📱' : '📁'
          });
        });
      }

      setActivities(sortedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();

    // Refresh every 10 seconds
    const interval = setInterval(loadActivities, 10000);
    return () => clearInterval(interval);
  }, [user?.id, maxItems]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'qr':
        return <QrCode className="w-4 h-4 text-purple-600" />;
      case 'file':
        return <Upload className="w-4 h-4 text-orange-600" />;
      default:
        return <Link className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className={`bg-[#ffffff] rounded-xl p-4 sm:p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col h-full ${className}`}>
        <div className="animate-pulse space-y-3 flex-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#ffffff] rounded-xl p-4 sm:p-6 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          <span>Live Activity</span>
        </h3>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-green-200" title="Live updates"></div>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {activities.map((activity) => (
            <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-900 transition-colors group gap-2 sm:gap-0">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 shrink-0 ${activity.type === 'qr' ? 'bg-purple-50 border-purple-200 group-hover:bg-purple-100 group-hover:border-purple-300' :
                    activity.type === 'file' ? 'bg-orange-50 border-orange-200 group-hover:bg-orange-100 group-hover:border-orange-300' :
                      'bg-blue-50 border-blue-200 group-hover:bg-blue-100 group-hover:border-blue-300'
                  }`}>
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-blue-600 font-mono truncate max-w-32">
                      {activity.shortUrl}
                    </p>
                    <span className="text-xs text-gray-400 flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{activity.clicks}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t-2 border-dashed border-gray-100 sm:border-0 pl-12 sm:pl-0 sm:ml-4">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {getTimeAgo(activity.timestamp)}
                </span>
                {showActions && (
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => copyToClipboard(activity.shortUrl)}
                      className="text-gray-400 hover:text-gray-900 bg-white p-1 rounded border border-gray-200 hover:border-gray-900 transition-colors"
                      title="Copy link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => window.open(activity.shortUrl, '_blank')}
                      className="text-gray-400 hover:text-gray-900 bg-white p-1 rounded border border-gray-200 hover:border-gray-900 transition-colors"
                      title="Open link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default LiveActivityFeed;