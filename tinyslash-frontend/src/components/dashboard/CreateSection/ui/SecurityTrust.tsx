import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { TrustBadgeConfig } from '../types';

interface SecurityTrustProps {
  trustBadgeConfig: TrustBadgeConfig;
  setTrustBadgeConfig: (config: TrustBadgeConfig) => void;
  featureAccess: any;
  upgradeModal: any;
}

export const SecurityTrust: React.FC<SecurityTrustProps> = ({
  trustBadgeConfig,
  setTrustBadgeConfig,
  featureAccess,
  upgradeModal
}) => {
  const handleProFeatureClick = () => {
    upgradeModal.open('Verified Trust Badge', 'Show users your link is safe & verified by Tinyslash to increase trust.', false);
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 flex items-center">
                Verified Trust Badge
                {!featureAccess.canUseTrustBadge && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">PRO</span>
                )}
              </h4>
              <p className="text-sm text-gray-500">Show users your link is verified safe</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {!featureAccess.canUseTrustBadge ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Display a "Verified Safe" interstitial page before redirecting.
              </span>
              <button
                onClick={handleProFeatureClick}
                className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
              >
                Upgrade to Verify
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trustBadgeConfig.requested}
                    onChange={(e) => setTrustBadgeConfig({ ...trustBadgeConfig, requested: e.target.checked })}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Display Trust Badge</span>
                </label>

                {trustBadgeConfig.status && (
                  <span className={`text-xs px-2 py-1 rounded font-medium ${trustBadgeConfig.status === 'approved' ? 'bg-green-100 text-green-700' :
                      trustBadgeConfig.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                    Status: {trustBadgeConfig.status.charAt(0).toUpperCase() + trustBadgeConfig.status.slice(1)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                When enabled, visitors will see a trusted verification screen for 2 seconds before being redirected.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
