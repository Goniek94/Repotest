import React, { memo } from 'react';

/**
 * 📋 PROFILE HEADER - Wspólny nagłówek dla wszystkich sekcji profilu
 * 
 * Ujednolicony nagłówek z białym tłem i delikatnym obramowaniem
 */
const ProfileHeader = memo(({ 
  title, 
  icon: Icon, 
  subtitle, 
  stats = [], 
  actions = null 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <Icon className="w-6 h-6 text-green-600" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
            {stats.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                  >
                    {stat.color && (
                      <div className={`w-2 h-2 ${stat.color} rounded-full mr-2`}></div>
                    )}
                    {stat.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex flex-col sm:flex-row gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
