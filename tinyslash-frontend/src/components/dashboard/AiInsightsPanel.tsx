import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ChevronRight, Zap, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AiInsightsPanelProps {
  stats: any | null;
  isLoading?: boolean;
  context?: 'dashboard' | 'analytics' | 'link';
}

interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'neutral' | 'action';
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  icon: React.ReactNode;
}

const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({ stats, isLoading, context = 'dashboard' }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const navigate = useNavigate();

  // Generate fake/demo insights based on stats for immediate UX value
  // In a real implementation, this would call a backend AI endpoint
  useEffect(() => {
    if (!stats || isLoading) return;

    setIsTyping(true);

    // Simulate API/AI generation delay
    const timer = setTimeout(() => {
      const generated: Insight[] = [];

      // Functional insight logic based on real stats
      if (stats.totalLinks === 0 && stats.totalQRCodes === 0 && stats.totalFiles === 0) {
        generated.push({
          id: 'welcome',
          type: 'action',
          title: 'Welcome to TinySlash! 🎉',
          description: 'Ready to start tracking? Create your first branded short link to begin gathering insights.',
          actionText: 'Create First Link',
          icon: <Sparkles className="w-5 h-5 text-indigo-600" />
        });
      }

      if (stats.clicksToday > 0 && stats.clicksThisWeek > 0) {
        const avgDaily = stats.clicksThisWeek / 7;
        if (stats.clicksToday > avgDaily * 1.5 && avgDaily > 2) {
          generated.push({
            id: 'traffic-spike',
            type: 'positive',
            title: 'Traffic Spike Detected! 🚀',
            description: `You've received ${stats.clicksToday.toLocaleString()} clicks today, which is ${Math.round((stats.clicksToday / Math.max(avgDaily, 1) - 1) * 100)}% above your average.`,
            actionText: 'View Sources',
            icon: <TrendingUp className="w-5 h-5 text-green-600" />
          });
        } else if (stats.clicksToday < avgDaily * 0.5 && avgDaily > 10) {
          generated.push({
            id: 'traffic-drop',
            type: 'warning',
            title: 'Traffic is slowing down',
            description: `Clicks are noticeably lower than your daily average of ${Math.round(avgDaily)}. Share your links to re-engage your audience!`,
            actionText: 'Share Links',
            icon: <AlertTriangle className="w-5 h-5 text-orange-600" />
          });
        }
      }

      if (stats.topPerformingLink && stats.topPerformingLink.clicks > 0) {
        const percentage = stats.totalClicks > 0 ? Math.round((stats.topPerformingLink.clicks / stats.totalClicks) * 100) : 0;

        if (percentage > 40 && stats.totalClicks > 50) {
          generated.push({
            id: 'top-link-heavy',
            type: 'action',
            title: 'Star Performer Identified 🌟',
            description: `"${stats.topPerformingLink.title || stats.topPerformingLink.shortUrl}" is driving ${percentage}% of your total traffic! Consider adding a tracking pixel to retarget these users.`,
            actionText: 'Add Retargeting',
            icon: <Zap className="w-5 h-5 text-indigo-600" />
          });
        } else {
          generated.push({
            id: 'top-link',
            type: 'positive',
            title: 'Top Link Gaining Traction',
            description: `"${stats.topPerformingLink.title || stats.topPerformingLink.shortUrl}" is your most popular link right now with ${stats.topPerformingLink.clicks.toLocaleString()} total clicks.`,
            icon: <Sparkles className="w-5 h-5 text-blue-600" />
          });
        }
      }

      const qrCount = stats.qrCodeCount || stats.totalQRCodes || 0;
      const fileCount = stats.fileLinksCount || stats.totalFiles || 0;

      if (stats.totalLinks > 0 && qrCount === 0) {
        generated.push({
          id: 'missing-qr',
          type: 'neutral',
          title: 'Unlock Offline Traffic 📱',
          description: 'You haven\'t created any QR codes yet. QR codes bridge the physical and digital world, perfect for print materials.',
          actionText: 'Create QR Code',
          actionLink: '/dashboard/qr-codes',
          icon: <Lightbulb className="w-5 h-5 text-yellow-600" />
        });
      } else if (stats.totalLinks > 0 && fileCount === 0 && generated.length < 3) {
        generated.push({
          id: 'missing-file',
          type: 'neutral',
          title: 'Share Files Securely 📁',
          description: 'Did you know you can host files and share them as trackable short links? Try our File Links feature.',
          actionText: 'Upload File',
          actionLink: '/dashboard/file-links',
          icon: <Lightbulb className="w-5 h-5 text-yellow-600" />
        });
      }

      if (stats.totalClicks > 100 && context === 'dashboard' && generated.length < 3) {
        generated.push({
          id: 'analytics-push',
          type: 'action',
          title: 'Dive Deeper into Data 🔍',
          description: `You have over ${stats.totalClicks.toLocaleString()} total clicks! Check out the Analytics Engine to see geographic and device breakdowns.`,
          actionText: 'View Analytics',
          actionLink: '/dashboard/analytics',
          icon: <BarChart3 className="w-5 h-5 text-indigo-600" />
        });
      }

      // Fallback if we didn't generate enough
      if (generated.length === 0) {
        generated.push({
          id: 'consistent',
          type: 'neutral',
          title: 'Consistent Performance',
          description: 'Your links are performing steadily. Keep creating and sharing content to grow your audience.',
          icon: <Sparkles className="w-5 h-5 text-blue-600" />
        });
      }

      // Prioritize insights: action > positive > warning > neutral
      const priorityMap = { action: 1, positive: 2, warning: 3, neutral: 4 };
      generated.sort((a, b) => priorityMap[a.type] - priorityMap[b.type]);

      // Ensure we don't have duplicate IDs if logic overlapped
      const uniqueGenerated = Array.from(new Map(generated.map(item => [item.id, item])).values());

      setInsights(uniqueGenerated.slice(0, 3)); // Max 3 insights
      setIsTyping(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [stats, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-[#fafafa] rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] p-5 animate-pulse">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500 animate-spin-slow" />
          <div className="h-5 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-100 rounded-lg border border-gray-200"></div>
          <div className="h-16 bg-gray-100 rounded-lg border border-gray-200"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-[#ffffff] rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] p-5 relative overflow-hidden group transition-all duration-300 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]">
      {/* Subtle decorative background noise/grid could go here via pseudo-elements if needed */}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-1.5 rounded-md shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-gray-900 tracking-tight">AI Insights</h3>
          {isTyping && (
            <span className="flex space-x-1 ml-2">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </div>
        <span className="text-[10px] sm:text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200 uppercase tracking-wider">
          Actionable Summary
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          // Color coding based on insight type
          let borderColor = 'border-gray-200';
          let bgColor = 'bg-gray-50';
          let hoverBgColor = 'hover:bg-gray-100';

          if (insight.type === 'positive') {
            borderColor = 'border-green-200';
            bgColor = 'bg-green-50/50';
            hoverBgColor = 'hover:bg-green-50';
          } else if (insight.type === 'action') {
            borderColor = 'border-indigo-200';
            bgColor = 'bg-indigo-50/50';
            hoverBgColor = 'hover:bg-indigo-50';
          } else if (insight.type === 'warning') {
            borderColor = 'border-orange-200';
            bgColor = 'bg-orange-50/50';
            hoverBgColor = 'hover:bg-orange-50';
          }

          return (
            <div
              key={insight.id}
              className={`flex flex-col h-full border ${borderColor} ${bgColor} ${hoverBgColor} rounded-lg p-4 transition-colors duration-200`}
              style={{
                opacity: isTyping ? 0 : 1,
                transform: isTyping ? 'translateY(10px)' : 'translateY(0)',
                transition: `all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 150}ms`
              }}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-shrink-0 mt-0.5">
                  {insight.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3 flex-grow ml-8 pl-0.5">
                {insight.description}
              </p>

              {insight.actionText && (
                <div className="mt-auto ml-8">
                  <button
                    onClick={() => insight.actionLink && navigate(insight.actionLink)}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center space-x-1 group/btn"
                  >
                    <span>{insight.actionText}</span>
                    <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div >
  );
};

export default AiInsightsPanel;
