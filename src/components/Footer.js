// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaEnvelope } from 'react-icons/fa';

function Footer() {
 return (
   <footer className="bg-gray-900 text-gray-300 pt-6 pb-2">
     <div className="container mx-auto max-w-5xl px-4">
       {/* Górna linia oddzielająca */}
       <hr className="border-t border-gray-700 w-full mx-auto rounded-full" />

       {/* Główna sekcja stopki */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
         
         {/* Logo z ikonami social media */}
         <div className="flex flex-col items-center md:items-start">
           <Link to="/" className="inline-block mb-4">
             <h2 className="text-2xl font-bold text-white">AutoSell.PL</h2>
           </Link>
           <div className="flex space-x-4 mt-2">
             <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <FaFacebookF size={20} />
             </a>
             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <FaInstagram size={20} />
             </a>
             <a href="mailto:kontakt@autosell.pl" className="text-gray-400 hover:text-white transition-colors">
               <FaEnvelope size={20} />
             </a>
           </div>
         </div>

         {/* Sekcja "Obsługa klienta" */}
         <div className="text-center md:text-left">
           <h3 className="text-base font-semibold text-white mb-3">Obsługa klienta</h3>
           <p className="text-sm">Telefon: <a href="tel:+48123456789" className="hover:text-white">+48 123 456 789</a></p>
           <p className="text-sm">Email: <a href="mailto:pomoc@autosell.pl" className="hover:text-white">pomoc@autosell.pl</a></p>
           <p className="text-sm mt-1">Pon-Pt: 08:00 - 17:00</p>
         </div>

         {/* Sekcja "AutoSell" */}
         <div className="text-center md:text-left">
           <h3 className="text-base font-semibold text-white mb-3">AutoSell</h3>
           <ul className="space-y-1 text-sm">
             <li><Link to="/cennik" className="hover:text-white">Cennik</Link></li>
             <li><Link to="/reklama" className="hover:text-white">Reklama</Link></li>
             <li><Link to="/polityka-prywatnosci" className="hover:text-white">Polityka prywatności</Link></li>
             <li><Link to="/regulamin" className="hover:text-white">Regulamin</Link></li>
           </ul>
         </div>

         {/* Nowa sekcja z linkami usuniętymi z nawigacji */}
         <div className="text-center md:text-left">
           <h3 className="text-base font-semibold text-white mb-3">Informacje</h3>
           <ul className="space-y-1 text-sm">
             <li><Link to="/FAQ" className="hover:text-white">FAQ</Link></li>
             <li><Link to="/Aboutcompany" className="hover:text-white">O Firmie</Link></li>
             <li><Link to="/contact" className="hover:text-white">Kontakt</Link></li>
           </ul>
         </div>
       </div>

       {/* Dolna linia oddzielająca */}
       <hr className="border-t border-gray-700 w-full mx-auto rounded-full" />

       {/* Prawa autorskie */}
       <div className="text-center text-xs text-gray-500 py-4">
         <p>© 2024 AutoSell. Wszelkie prawa zastrzeżone.</p>
       </div>
     </div>
   </footer>
 );
}

export default Footer;