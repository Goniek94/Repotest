import React, { useState } from 'react';
import { Settings, Shield, Bell } from 'lucide-react';
import SettingsGeneral from './SettingsGeneral';
import SettingsSecurity from './SettingsSecurity';
import SettingsNotifications from './SettingsNotifications';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { key: 'general', label: 'Ogólne', icon: Settings, component: SettingsGeneral },
    { key: 'security', label: 'Bezpieczeństwo', icon: Shield, component: SettingsSecurity },
    { key: 'notifications', label: 'Powiadomienia', icon: Bell, component: SettingsNotifications }
  ];

  const ActiveComponent = tabs.find(tab => tab.key === activeTab)?.component;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ustawienia</h1>
        <p className="text-gray-600">Zarządzaj ustawieniami systemu</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;