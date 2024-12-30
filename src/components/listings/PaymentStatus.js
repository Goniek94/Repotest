import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentStatus = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const status = query.get('status'); // np. ?status=sukces, ?status=error, ?status=anulowano

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-4">
          {status === 'sukces' ? 'Płatność zakończona pomyślnie!' :
           status === 'error' ? 'Błąd płatności' : 
           'Płatność została anulowana'}
        </h1>
        <p className="text-gray-700">
          {status === 'sukces' ? 'Dziękujemy za dokonanie płatności.' :
           status === 'error' ? 'Niestety, nie udało się zrealizować płatności.' : 
           'Twoja płatność została anulowana.'}
        </p>
      </div>
    </div>
  );
};

export default PaymentStatus;
