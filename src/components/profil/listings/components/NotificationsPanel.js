import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const NotificationsPanel = ({ 
  notifications, 
  onExtend, 
  extendingId, 
  calculateDaysRemaining 
}) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-sm"></div>
      
      <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50/60 backdrop-blur-sm border border-amber-200/60 p-6 rounded-2xl shadow-xl shadow-amber-200/25">
        <div className="flex items-start">
          <AlertTriangle className="text-amber-500 w-6 h-6 mr-3 mt-1 drop-shadow-sm" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 text-lg mb-3">
              Uwaga! Masz ogłoszenia, które wkrótce wygasną:
            </h3>
            <div className="space-y-3">
              {notifications.map(ad => (
                <div key={ad._id} className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-amber-100/80 shadow-md">
                  <div>
                    <span className="font-medium text-gray-900">
                      {ad.headline || `${ad.brand} ${ad.model}`}
                    </span>
                    <span className="ml-3 text-sm text-gray-600">
                      Kończy się za <span className="font-bold text-amber-600">
                        {calculateDaysRemaining(ad.createdAt)}
                      </span> dni
                    </span>
                  </div>
                  <button
                    onClick={() => onExtend(ad._id)}
                    disabled={extendingId === ad._id}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {extendingId === ad._id ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span> Przedłużanie...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" /> Przedłuż o 30 dni
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
