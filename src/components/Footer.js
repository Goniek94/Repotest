import React from 'react';
import { Facebook, Instagram, Mail } from 'lucide-react';

/**
 * Komponent stopki z całkowicie niezależną wersją dla urządzeń mobilnych
 * Wersja mobilna: całkowicie oddzielny komponent wizualnie
 * Wersja desktopowa: standardowa
 */
const Footer = () => {
  return (
    <footer className="w-full">
      {/* WERSJA MOBILNA - standardowy element pod paskiem nawigacji */}
      <div className="md:hidden">
        {/* Stopka mobilna - statyczny element pod paskiem nawigacji */}
        <div className="w-full bg-gray-900 z-50 static mt-auto">
          <div className="w-full">
            {/* Stopka jednopoziomowa pod paskiem nawigacji */}
            <div className="flex items-center justify-between px-4 h-8">
              {/* Logo */}
              <div className="text-white font-semibold text-xs">AutoSell.PL</div>
              
              {/* Linki */}
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 text-[11px] hover:text-white">O firmie</a>
                <a href="#" className="text-gray-300 text-[11px] hover:text-white">Regulamin</a>
                <a href="#" className="text-gray-300 text-[11px] hover:text-white">Kontakt</a>
              </div>
              
              {/* Copyright i ikony */}
              <div className="flex items-center">
                <span className="text-[9px] text-gray-400 mr-2">© 2024</span>
                <div className="flex space-x-1.5">
                  <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white">
                    <Facebook size={12} />
                  </a>
                  <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white">
                    <Instagram size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WERSJA DESKTOPOWA - standardowy układ */}
      <div className="hidden md:block bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-between">
            <div className="w-1/4">
              <h3 className="font-bold mb-3">AutoSell.PL</h3>
              <div className="flex space-x-3 mb-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail size={16} />
                </a>
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
                <li><a href="#" className="text-gray-300 hover:text-white">Cennik</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Reklama</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Polityka prywatności</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Regulamin</a></li>
              </ul>
            </div>
            
            <div className="w-1/4">
              <h3 className="font-bold mb-3">Informacje</h3>
              <ul className="text-sm space-y-1">
                <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">O Firmie</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Kontakt</a></li>
              </ul>
            </div>
          </div>
          
          {/* Copyright na desktopie */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2024 AutoSell. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;