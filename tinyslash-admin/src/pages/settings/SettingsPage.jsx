import React from 'react';
import { Settings, Shield, Bell, Globe } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your application preferences and system configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
              <Shield className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Configure password policies, 2FA, and session timeouts.</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">Manage Security &rarr;</button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-3">
              <Bell className="text-purple-600 dark:text-purple-300" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Manage email alerts, push notifications, and system updates.</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">Configure Alerts &rarr;</button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
              <Globe className="text-green-600 dark:text-green-300" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Preferences</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Set language, timezone, and regional settings.</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">Edit Preferences &rarr;</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
