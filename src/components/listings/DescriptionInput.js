import React, { useState } from 'react';

const DescriptionInput = () => {
  const [description, setDescription] = useState(""); // Ustawienie początkowego stanu

  // Funkcja obsługująca zmianę opisu
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value); // Aktualizacja stanu za każdym razem, gdy użytkownik wpisze coś
  };

  return (
    <div className="space-y-8">
      {/* Sekcja opisu */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Dodaj opis*</h3>

        {/* Informacje o tym, co wpisać */}
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
          <p className="text-sm">
            W opisie powinny znaleźć się najważniejsze informacje o pojeździe:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>Stan techniczny pojazdu</li>
            <li>Historia serwisowa</li>
            <li>Wyposażenie dodatkowe</li>
            <li>Ostatnio wykonane naprawy</li>
            <li>Informacje o usterkach (jeśli występują)</li>
          </ul>
        </div>

        {/* Pole tekstowe do wpisywania opisu */}
        <div>
          <textarea
            rows="6"
            maxLength="2000" // Maksymalna liczba znaków
            placeholder="Wpisz opis pojazdu..."
            className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={description} // Powiązanie z wartością stanu
            onChange={handleDescriptionChange} // Obsługa zmiany wprowadzanej treści
          ></textarea>
          <div className="mt-2 text-sm text-gray-500 text-right">
            {description.length} / 2000 znaków {/* Dynamiczny licznik */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionInput;
