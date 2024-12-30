import React from 'react';

const UserListings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-[2px]">
        <div className="bg-[#35530A] text-white p-4 rounded-t-[2px]">
          <h2 className="text-xl font-bold uppercase">Moje ogłoszenia</h2>
        </div>
        <div className="p-6">
          <p>Tutaj będą Twoje ogłoszenia</p>
        </div>
      </div>
    </div>
  );
};

export default UserListings;