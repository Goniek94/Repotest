import React, { memo } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  User, 
  MapPin, 
  FileText, 
  Download, 
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';

/**
 * 📄 TRANSACTION DETAILS PANEL - Panel szczegółów transakcji
 * 
 * Wyświetla szczegółowe informacje o wybranej transakcji
 * Slide-in panel podobny do ChatPanel
 */
const TransactionDetailsPanel = memo(({ 
  isVisible,
  transaction,
  onBack,
  onDownloadReceipt
}) => {
  if (!transaction) {
    return (
      <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Wybierz transakcję aby zobaczyć szczegóły</p>
        </div>
      </div>
    );
  }

  // Formatowanie daty
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatowanie kwoty
  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(Math.abs(numericAmount));
  };

  // Ikona statusu
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'zakończona':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'w trakcie':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'anulowana':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'zwrot':
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  // Kolor statusu
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'zakończona':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'w trakcie':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'anulowana':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'zwrot':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Ikona metody płatności
  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'karta kredytowa':
      case 'karta debetowa':
        return '💳';
      case 'blik':
        return '📱';
      case 'przelew bankowy':
        return '🏦';
      case 'paypal':
        return '🅿️';
      default:
        return '💰';
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
      {/* Nagłówek */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Szczegóły transakcji
            </h2>
            <p className="text-sm text-gray-600">
              ID: {transaction.id}
            </p>
          </div>
        </div>
      </div>

      {/* Zawartość */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Status i kwota */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            {getStatusIcon(transaction.status)}
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${
            getStatusColor(transaction.status)
          }`}>
            {transaction.status}
          </div>
          
          <h3 className={`text-3xl font-bold mb-2 ${
            transaction.amount.includes('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.amount.includes('+') ? '+' : '-'}{formatCurrency(transaction.amount)}
          </h3>
          
          <p className="text-gray-600">
            {transaction.amount.includes('+') ? 'Przychód' : 'Wydatek'}
          </p>
        </div>

        {/* Szczegóły transakcji */}
        <div className="space-y-6">
          {/* Podstawowe informacje */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Informacje podstawowe
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Opis:</span>
                <span className="font-medium text-gray-900 text-right">
                  {transaction.description}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(transaction.date)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Kategoria:</span>
                <span className="font-medium text-gray-900">
                  {transaction.category}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Typ:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {transaction.type === 'sale' ? 'Sprzedaż' :
                   transaction.type === 'premium' ? 'Premium' :
                   transaction.type === 'promotion' ? 'Promocja' :
                   transaction.type === 'refund' ? 'Zwrot' : transaction.type}
                </span>
              </div>
            </div>
          </div>

          {/* Metoda płatności */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Płatność
            </h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getPaymentMethodIcon(transaction.paymentMethod)}
                </span>
                <span className="font-medium text-gray-900">
                  {transaction.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Powiązane ogłoszenie (jeśli istnieje) */}
          {transaction.adTitle && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Powiązane ogłoszenie
              </h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.adTitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    ID: {transaction.adId}
                  </p>
                </div>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Zobacz ogłoszenie
                </button>
              </div>
            </div>
          )}

          {/* Dodatkowe informacje */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              Informacje dodatkowe
            </h4>
            <p className="text-sm text-blue-800">
              {transaction.type === 'premium' && 'Ta transakcja dotyczy opłaty za pakiet premium dla Twojego ogłoszenia.'}
              {transaction.type === 'promotion' && 'Ta transakcja dotyczy opłaty za wyróżnienie ogłoszenia.'}
              {transaction.type === 'sale' && 'Ta transakcja dotyczy sprzedaży Twojego produktu.'}
              {transaction.type === 'refund' && 'Ta transakcja to zwrot środków za anulowane ogłoszenie.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stopka z akcjami */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <button
            onClick={() => onDownloadReceipt && onDownloadReceipt(transaction)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Pobierz paragon</span>
          </button>
          
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Zgłoś problem
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          Masz pytania? Skontaktuj się z naszym działem obsługi klienta
        </p>
      </div>
    </div>
  );
});

TransactionDetailsPanel.displayName = 'TransactionDetailsPanel';

export default TransactionDetailsPanel;
