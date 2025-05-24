import React from "react";
import { Phone } from "lucide-react";

/**
 * PhoneSection component displays the phone number directly for logged-in users.
 * @param {Object} props
 * @param {Object} props.listing - Listing object containing ownerPhone.
 */
const PhoneSection = ({ listing }) => {
  // Check if user is logged in (token in localStorage)
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <div className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-500 py-3 px-4 rounded-lg text-lg">
        <Phone className="w-5 h-5" />
        <span>Zaloguj się, aby zobaczyć numer telefonu</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="text-sm text-gray-500 mb-1.5">Numer telefonu:</div>
      <div className="flex items-center">
        <div className="bg-[#e9f5e1] p-2.5 rounded-lg mr-3">
          <Phone className="w-6 h-6 text-[#35530A]" />
        </div>
        <div className="text-xl font-bold text-gray-800">
          {listing?.ownerPhone || "+48 123 456 789"}
        </div>
      </div>
    </div>
  );
};

export default PhoneSection;
