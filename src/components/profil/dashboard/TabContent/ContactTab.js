import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Send, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  MapPin,
  Users,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * Komponent karty kontaktu w panelu użytkownika
 * @returns {JSX.Element}
 */
const ContactTab = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  // Mobile accordion states
  const [openSection, setOpenSection] = useState(null);

  // Obsługa zmiany pól formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Obsługa wysłania formularza
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, error: null });
    
    // Symulacja wysłania formularza
    setTimeout(() => {
      setSubmitStatus({ 
        loading: false, 
        success: true, 
        error: null 
      });
      
      // Reset formularza po pomyślnym wysłaniu
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset komunikatu o sukcesie po 3 sekundach
      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    }, 1500);
  };

  // Toggle for mobile accordion sections
  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      {/* Nagłówek z gradientem */}
      <div className="bg-gradient-to-r from-[#35530A] to-[#5A7D2A] px-4 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Phone className="mr-2" size={20} />
          Kontakt
        </h2>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formularz kontaktowy */}
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skontaktuj się z nami</h3>
              
              {submitStatus.success && (
                <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg flex items-center">
                  <CheckCircle size={18} className="mr-2" />
                  Twoja wiadomość została wysłana! Odpowiemy najszybciej jak to możliwe.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Imię i nazwisko
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] transition-all duration-200"
                    placeholder="Wprowadź swoje imię i nazwisko"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adres e-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] transition-all duration-200"
                    placeholder="Wprowadź swój adres e-mail"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Temat
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] transition-all duration-200"
                    placeholder="Wprowadź temat wiadomości"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Wiadomość
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] transition-all duration-200"
                    placeholder="Wprowadź treść wiadomości"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#35530A] hover:bg-[#446914] text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  disabled={submitStatus.loading}
                >
                  {submitStatus.loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Wysyłanie...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Wyślij wiadomość
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Informacje kontaktowe */}
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dane kontaktowe</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-green-50 rounded-full mr-3">
                    <Phone size={18} className="text-[#35530A]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Telefon</p>
                    <a href="tel:+48123456789" className="text-[#35530A] hover:underline">+48 123 456 789</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-green-50 rounded-full mr-3">
                    <Mail size={18} className="text-[#35530A]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <a href="mailto:pomoc@autosell.pl" className="text-[#35530A] hover:underline">pomoc@autosell.pl</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-green-50 rounded-full mr-3">
                    <MapPin size={18} className="text-[#35530A]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Adres</p>
                    <p className="text-gray-600">ul. Przykładowa 123<br />00-000 Warszawa</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-green-50 rounded-full mr-3">
                    <Users size={18} className="text-[#35530A]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Godziny pracy</p>
                    <p className="text-gray-600">Poniedziałek - Piątek: 8:00 - 17:00</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-3">Media społecznościowe</h4>
                <div className="flex space-x-2">
                  <SocialButton icon={<Facebook size={18} />} color="bg-blue-600" />
                  <SocialButton icon={<Instagram size={18} />} color="bg-pink-600" />
                  <SocialButton icon={<Twitter size={18} />} color="bg-blue-400" />
                  <SocialButton icon={<Linkedin size={18} />} color="bg-blue-700" />
                  <SocialButton icon={<Youtube size={18} />} color="bg-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact footer for mobile, horizontal layout */}
      <div className="bg-gray-900 text-white">
        {/* Mobile footer with accordion sections */}
        <div className="md:hidden">
          <AccordionSection 
            title="Obsługa klienta" 
            isOpen={openSection === 'support'} 
            onClick={() => toggleSection('support')}
          >
            <div className="px-4 py-2 text-sm">
              <div className="flex items-center mb-1.5">
                <Phone size={14} className="mr-2 text-gray-400" />
                <a href="tel:+48123456789" className="text-gray-300 hover:text-white">+48 123 456 789</a>
              </div>
              <div className="flex items-center mb-1.5">
                <Mail size={14} className="mr-2 text-gray-400" />
                <a href="mailto:pomoc@autosell.pl" className="text-gray-300 hover:text-white">pomoc@autosell.pl</a>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-xs">Pon-Pt: 08:00 - 17:00</span>
              </div>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            title="AutoSell" 
            isOpen={openSection === 'company'} 
            onClick={() => toggleSection('company')}
          >
            <div className="px-4 py-2 text-sm grid grid-cols-2 gap-2">
              <button className="text-gray-300 hover:text-white text-left">Cennik</button>
              <button className="text-gray-300 hover:text-white text-left">Reklama</button>
              <button className="text-gray-300 hover:text-white text-left">Polityka prywatności</button>
              <button className="text-gray-300 hover:text-white text-left">Regulamin</button>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            title="Informacje" 
            isOpen={openSection === 'info'} 
            onClick={() => toggleSection('info')}
          >
            <div className="px-4 py-2 text-sm grid grid-cols-2 gap-2">
              <button className="text-gray-300 hover:text-white text-left">FAQ</button>
              <button className="text-gray-300 hover:text-white text-left">O Firmie</button>
              <button className="text-gray-300 hover:text-white text-left">Kontakt</button>
            </div>
          </AccordionSection>
        </div>
        
        {/* Desktop footer with horizontal layout */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap justify-between">
              <div className="w-1/4">
                <h3 className="font-bold mb-3">AutoSell.PL</h3>
                <div className="flex space-x-3 mb-2">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Facebook size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Instagram size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Mail size={16} />
                  </button>
                </div>
              </div>
              
              <div className="w-1/4">
                <h3 className="font-bold mb-3">Obsługa klienta</h3>
                <div className="text-sm">
                  <p className="mb-1">Telefon: <a href="tel:+48123456789" className="text-gray-300 hover:text-white">+48 123 456 789</a></p>
                  <p className="mb-1">Email: <a href="mailto:pomoc@autosell.pl" className="text-gray-300 hover:text-white">pomoc@autosell.pl</a></p>
                  <p className="text-gray-400">Pon-Pt: 08:00 - 17:00</p>
                </div>
              </div>
              
              <div className="w-1/4">
                <h3 className="font-bold mb-3">AutoSell</h3>
                <ul className="text-sm space-y-1">
                  <li><button className="text-gray-300 hover:text-white text-left">Cennik</button></li>
                  <li><button className="text-gray-300 hover:text-white text-left">Reklama</button></li>
                  <li><button className="text-gray-300 hover:text-white text-left">Polityka prywatności</button></li>
                  <li><button className="text-gray-300 hover:text-white text-left">Regulamin</button></li>
                </ul>
              </div>
              
              <div className="w-1/4">
                <h3 className="font-bold mb-3">Informacje</h3>
                <ul className="text-sm space-y-1">
                  <li><button className="text-gray-300 hover:text-white text-left">FAQ</button></li>
                  <li><button className="text-gray-300 hover:text-white text-left">O Firmie</button></li>
                  <li><button className="text-gray-300 hover:text-white text-left">Kontakt</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright - Compact for all screen sizes */}
        <div className="bg-gray-950 py-2 text-center text-xs text-gray-400">
          © 2024 AutoSell. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </div>
  );
};

// Komponent przycisku mediów społecznościowych
const SocialButton = ({ icon, color }) => (
  <button 
    className={`${color} text-white p-2 rounded-full hover:opacity-90 transition-opacity`}
    aria-label="Social Media Link"
  >
    {icon}
  </button>
);

// Komponent sekcji accordion dla mobilnego footera
const AccordionSection = ({ title, isOpen, onClick, children }) => (
  <div className="border-t border-gray-800">
    <button 
      className="w-full px-4 py-2.5 flex justify-between items-center"
      onClick={onClick}
    >
      <span className="font-medium">{title}</span>
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
      {children}
    </div>
  </div>
);

export default ContactTab;
