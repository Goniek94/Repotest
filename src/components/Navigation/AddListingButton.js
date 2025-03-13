// AddListingButton.js
import { Link } from 'react-router-dom';

const AddListingButton = ({ user, setIsLoginModalOpen }) => (
  <Link
    to={user ? '/createlisting' : '#'}
    onClick={(e) => {
      if (!user) {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    }}
    className="inline-flex items-center bg-yellow-500 px-4 py-2 rounded-[2px] shadow-md font-bold uppercase text-white hover:bg-yellow-600 transition-colors text-sm lg:text-base xl:text-lg"
  >
    Dodaj ogłoszenie
  </Link>
);

export default AddListingButton;