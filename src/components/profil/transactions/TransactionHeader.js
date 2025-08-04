import React, { memo } from 'react';
import { CreditCard } from 'lucide-react';

/**
 * 💳 TRANSACTION HEADER - Nagłówek sekcji historii transakcji
 * 
 * Wyświetla tytuł w stylu gradientowym jak inne zakładki
 */
const TransactionHeader = memo(({ 
  totalTransactions = 0
}) => {
  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 rounded-2xl shadow-xl p-8 mb-8" style={{background: 'linear-gradient(135deg, #35530A, #4a7c0c, #35530A)'}}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Historia Transakcji
            </h1>
            {totalTransactions > 0 && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                {totalTransactions} {totalTransactions === 1 ? 'transakcja' : totalTransactions < 5 ? 'transakcje' : 'transakcji'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TransactionHeader.displayName = 'TransactionHeader';

export default TransactionHeader;
