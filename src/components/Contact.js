import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formularz wysłany:', formData);
    alert('Twoja wiadomość została wysłana!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Nagłówek */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Skontaktuj się z nami</h1>
          <p className="text-lg text-gray-600">
            Masz pytania? Wypełnij formularz lub skorzystaj z danych kontaktowych poniżej.
          </p>
        </div>

        {/* Sekcja z formularzem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formularz kontaktowy */}
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Formularz kontaktowy</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Imię i nazwisko
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Wpisz swoje imię i nazwisko"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adres e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Wpisz swój e-mail"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Wiadomość
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="5"
                placeholder="Napisz swoją wiadomość"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Wyślij wiadomość
            </button>
          </form>

          {/* Dane kontaktowe */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Dane kontaktowe</h2>
            <p className="text-gray-600 mb-4">
              <strong>Telefon:</strong> +48 123 456 789
            </p>
            <p className="text-gray-600 mb-4">
              <strong>E-mail:</strong> pomoc@autosell.pl
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Adres:</strong> Ul. Przykładowa 12, 00-123 Warszawa
            </p>
            <div className="mt-6">
              <iframe
                title="Mapa lokalizacji"
                src="https://maps.google.com/maps?q=Warszawa&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-64 rounded-lg"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
