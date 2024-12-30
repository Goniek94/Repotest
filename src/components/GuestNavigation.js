import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function GuestNavigation({ openLoginModal }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateListingClick = () => {
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      {/* Menu dla użytkownika niezalogowanego */}
      <div className="hidden md:flex items-center gap-6 ml-8"> {/* Added margin-left for positioning */}
        <button
          onClick={handleCreateListingClick}
          className="bg-yellow-500 text-green-800 font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-transform hover:scale-110 text-base tracking-wide shadow-md"
        >
          Dodaj ogłoszenie
        </button>
        <button
          onClick={openLoginModal}
          className="hover:text-[#123524] transition-colors uppercase font-semibold text-sm lg:text-base tracking-wider"
        >
          Zaloguj się
        </button>
        <Link
          to="/register"
          className="hover:text-[#123524] transition-colors uppercase font-semibold text-sm lg:text-base tracking-wider"
        >
          Zarejestruj się
        </Link>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal} // Close the modal when clicking outside
        >
          <div
            className="bg-white rounded-lg p-6 shadow-lg relative w-[90%] max-w-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={closeModal} // Close modal on clicking "X"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-gray-800">Musisz być zalogowany!</h2>
            <p className="text-gray-600">
              Aby dodać ogłoszenie, musisz się zalogować. Jeśli nie masz konta, możesz się zarejestrować, klikając poniżej:
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={openLoginModal}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Zaloguj się
              </button>
              <Link
                to="/register"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Zarejestruj się
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GuestNavigation;
