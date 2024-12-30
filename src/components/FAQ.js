import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'Jak dodać ogłoszenie?',
      answer: 'Przejdź do zakładki "Dodaj ogłoszenie" i wypełnij formularz. Po zapisaniu, ogłoszenie zostanie opublikowane.',
    },
    {
      question: 'Jak mogę zarządzać ulubionymi?',
      answer: 'Kliknij ikonę serca na dowolnym ogłoszeniu, aby dodać je do ulubionych. Wszystkie ulubione znajdziesz w sekcji "Ulubione".',
    },
    {
      question: 'Jak mogę się zarejestrować?',
      answer: 'Kliknij "Zarejestruj się" w prawym górnym rogu strony i wypełnij formularz rejestracyjny.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Najczęściej zadawane pytania (FAQ)</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-600">{faq.question}</h2>
            <p className="text-gray-700 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
