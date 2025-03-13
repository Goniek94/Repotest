// AuthButtons.js
import { Link } from 'react-router-dom';

const AuthButtons = ({ setIsLoginModalOpen }) => (
  <div className="hidden md:flex items-center gap-3 lg:gap-4">
    <button
      onClick={() => setIsLoginModalOpen(true)}
      className="px-4 py-2 font-bold uppercase hover:bg-gray-800 bg-gray-900 text-white rounded-[2px] transition-colors text-sm lg:text-base xl:text-lg"
    >
      Zaloguj się
    </button>
    <Link
      to="/register"
      className="px-4 py-2 font-bold uppercase hover:bg-gray-800 bg-gray-900 text-white rounded-[2px] transition-colors text-sm lg:text-base xl:text-lg"
    >
      Zarejestruj się
    </Link>
  </div>
);

export default AuthButtons;