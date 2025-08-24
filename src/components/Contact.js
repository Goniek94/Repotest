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
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-[2px] shadow-lg border border-gray-200">
        {/* NAGŁÓWEK – zielony pasek */}
        <div className="bg-[#35530A] text-white p-4 rounded-t-[2px] -mx-8 -mt-8 mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            Skontaktuj się z nami
          </h1>
          <p className="text-sm mt-1 italic">
            Masz pytania? Wypełnij formularz lub skorzystaj z danych kontaktowych
            poniżej.
          </p>
        </div>

        {/* SEKCJA GŁÓWNA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FORMULARZ KONTAKTOWY */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#F9F9F9] p-6 rounded-[2px] shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4 uppercase">
              Formularz kontaktowy
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Wypełnij poniższe pola, a nasz zespół odpowie w ciągu 24 godzin.
            </p>

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
                className="
                  w-full mt-2 p-3 border border-gray-300 rounded-[2px] 
                  focus:ring-2 focus:ring-[#35530A] focus:outline-none
                "
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
                className="
                  w-full mt-2 p-3 border border-gray-300 rounded-[2px] 
                  focus:ring-2 focus:ring-[#35530A] focus:outline-none
                "
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
                className="
                  w-full mt-2 p-3 border border-gray-300 rounded-[2px] 
                  focus:ring-2 focus:ring-[#35530A] focus:outline-none
                "
                rows="5"
                placeholder="Napisz swoją wiadomość"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="
                bg-[#35530A] text-white py-2 px-6 rounded-[2px] 
                hover:bg-[#2a4208] transition-colors uppercase font-semibold
              "
            >
              Wyślij wiadomość
            </button>
          </form>

          {/* DANE KONTAKTOWE */}
          <div
            className="
              bg-[#F9F9F9] p-6 rounded-[2px] shadow-md 
              border border-gray-100 flex flex-col justify-between
            "
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 uppercase">
                Dane kontaktowe
              </h2>
              <p className="text-gray-600 mb-2">
                <strong>Telefon:</strong> +48 123 456 789
              </p>
              <p className="text-gray-600 mb-2">
                <strong>E-mail:</strong> pomoc@autosell.pl
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Adres:</strong> Ul. Przykładowa 12, 00-123 Warszawa
              </p>
              <p className="text-gray-600 mb-4 text-sm">
                Zapraszamy do odwiedzin naszego biura w dni powszednie w godzinach
                9:00 – 17:00. Prosimy o wcześniejszy kontakt telefoniczny.
              </p>
            </div>

            {/* MAPA */}
            <div className="mt-4">
              <iframe
                title="Mapa lokalizacji"
                src="https://maps.google.com/maps?q=Warszawa&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-64 rounded-[2px] border border-gray-300"
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
