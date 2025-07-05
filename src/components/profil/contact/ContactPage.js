import React, { useState } from 'react';
import { Mail, Phone, Clock, MessageCircle, MapPin } from 'lucide-react';

/**
 * Komponent strony kontaktowej w profilu użytkownika
 * Wyświetla dane kontaktowe w nowoczesnej, interaktywnej formie
 * Dostosowany do urządzeń mobilnych i iPadów
 */
const ContactPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const contactMethods = [
    {
      icon: Phone,
      title: "Telefon",
      content: "+48 510 273 086",
      href: "tel:+48510273086",
      gradient: "from-[#35530A] to-[#4a6b15]",
      description: "Zadzwoń teraz"
    },
    {
      icon: Mail,
      title: "Email",
      content: "kontakt@autosell.pl",
      href: "mailto:kontakt@autosell.pl",
      gradient: "from-[#35530A] to-[#4a6b15]",
      description: "Napisz do nas"
    }
  ];

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 mt-4 sm:mt-8 ml-0 sm:ml-6 rounded-lg shadow-md">
      <div className="w-full max-w-6xl mx-auto">
        {/* Metody kontaktu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 mb-6 sm:mb-10">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl p-5 sm:p-7 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex justify-center">
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${method.gradient} rounded-xl mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 text-center">{method.title}</h3>
              
              <a 
                href={method.href}
                className="text-base sm:text-lg font-semibold text-[#35530A] hover:underline block mb-2 break-all text-center"
              >
                {method.content}
              </a>
              
              <p className="text-gray-600 text-center">{method.description}</p>
              
              {hoveredCard === index && (
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#35530A] to-[#4a6b15] w-full rounded-b-xl"></div>
              )}
            </div>
          ))}
        </div>

        {/* Godziny pracy */}
        <div className="bg-white rounded-xl p-5 sm:p-7 shadow-md mb-5 sm:mb-8 border border-gray-100">
          <div className="flex items-center justify-center mb-3 sm:mb-5">
            <div className="bg-[#35530A] p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Godziny pracy</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Poniedziałek - Piątek</span>
              <span className="text-[#35530A] font-semibold">8:00 - 16:00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Sobota</span>
              <span className="text-[#35530A] font-semibold">9:00 - 13:00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Niedziela</span>
              <span className="text-gray-500 font-semibold">Zamknięte</span>
            </div>
          </div>
        </div>

        {/* Informacje dodatkowe */}
        <div className="bg-gradient-to-r from-[#35530A]/10 to-[#4a6b15]/10 rounded-xl p-5 sm:p-7 text-center mb-5 sm:mb-8">
          <div className="bg-[#35530A] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4 sm:mb-5 mx-auto">
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">Informacje dodatkowe</h3>
          <p className="text-gray-600 mb-2">
            W przypadku pilnych spraw prosimy o kontakt telefoniczny.
          </p>
          <p className="text-gray-600">
            Na wiadomości email odpowiadamy w ciągu 24 godzin w dni robocze.
          </p>
        </div>

        {/* Adres */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6 border border-gray-100">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="bg-[#35530A] p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Adres</h3>
          </div>
          <p className="text-gray-600 text-center">ul. Motoryzacyjna 123</p>
          <p className="text-gray-600 mb-4 text-center">00-001 Warszawa</p>
          
          {/* Mapa lokalizacji */}
          <div className="bg-gray-100 h-48 sm:h-72 rounded-lg flex items-center justify-center mt-4 sm:mt-5">
            <p className="text-gray-500">Mapa lokalizacji</p>
          </div>
        </div>
        
        {/* Obsługiwane marki */}
        <div className="bg-white rounded-xl p-5 sm:p-7 shadow-md border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-3 sm:mb-4 text-center">Obsługiwane marki:</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Opel'].map(brand => (
              <span key={brand} className="bg-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm border border-gray-200 hover:bg-[#35530A] hover:text-white hover:border-[#35530A] transition-colors duration-300">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
