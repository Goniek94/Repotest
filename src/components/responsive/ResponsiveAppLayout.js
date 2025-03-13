import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ResponsiveWrapper from './ResponsiveWrapper';
import ResponsiveSearchContainer from './ResponsiveSearchContainer';
import ResponsiveListingsContainer from './ResponsiveListingsContainer';

const ResponsiveAppLayout = () => {
  return (
    <div className="bg-[#F5F7F9] min-h-screen">
      <ResponsiveWrapper className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <Routes>
          {/* Strona główna */}
          <Route path="/" element={
            <>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#35530A] text-center mb-4 sm:mb-6">
                ZNAJDŹ SAMOCHÓD MARZEŃ
              </h1>
              <ResponsiveSearchContainer />
              <div className="my-4 md:my-6">
                <ResponsiveListingsContainer />
              </div>
            </>
          } />
          
          {/* Strona z ogłoszeniami */}
          <Route path="/listings" element={
            <>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#35530A] text-center mb-4 sm:mb-6">
                OGŁOSZENIA
              </h1>
              <ResponsiveSearchContainer />
              <div className="my-4 md:my-6">
                <ResponsiveListingsContainer />
              </div>
            </>
          } />
          
          {/* Podstrona szczegółów ogłoszenia */}
          <Route path="/listing/:id" element={
            <div className="max-w-7xl mx-auto bg-white rounded-[2px] p-4 sm:p-6">
              <h1 className="text-2xl font-bold text-[#35530A] mb-4">Szczegóły ogłoszenia</h1>
              {/* Tu dodaj komponent szczegółów ogłoszenia */}
            </div>
          } />
        </Routes>
      </ResponsiveWrapper>
    </div>
  );
};

export default ResponsiveAppLayout;