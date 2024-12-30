import React from 'react';

const CarUserProfile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-[2px] border border-[#35530A]">
        <div className="bg-[#35530A] text-white p-4 rounded-t-[2px]">
          <h2 className="text-xl font-bold uppercase">Profil Użytkownika - Platforma Samochodowa</h2>
        </div>
        
        <form className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dane osobowe */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Dane osobowe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Imię</label>
                  <input 
                    type="text"
                    className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                    placeholder="Wprowadź imię"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Nazwisko</label>
                  <input 
                    type="text"
                    className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                    placeholder="Wprowadź nazwisko"
                  />
                </div>
              </div>
            </div>

            {/* Dane kontaktowe */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Dane kontaktowe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Email</label>
                  <input 
                    type="email"
                    className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                    placeholder="przyklad@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Telefon</label>
                  <input 
                    type="tel"
                    className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                    placeholder="123 456 789"
                  />
                </div>
              </div>
            </div>

            {/* Adres */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Adres</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Miasto</label>
                  <input 
                    type="text"
                    className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                    placeholder="Wprowadź miasto"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Kod pocztowy</label>
                  <input 
                    type="text"
                    className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                    placeholder="00-000"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium uppercase">Adres</label>
                  <input 
                    type="text"
                    className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                    placeholder="Wprowadź pełny adres"
                  />
                </div>
              </div>
            </div>

            {/* Preferencje samochodowe */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Preferencje samochodowe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Ulubiona marka</label>
                  <input 
                    type="text"
                    className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                    placeholder="np. BMW, Audi, Mercedes"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Preferowany typ nadwozia</label>
                  <select className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]">
                    <option value="">Wybierz typ nadwozia</option>
                    <option value="sedan">Sedan</option>
                    <option value="kombi">Kombi</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="coupe">Coupe</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Budżet (PLN)</label>
                  <select className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]">
                    <option value="">Wybierz zakres</option>
                    <option value="0-10000">do 10 000</option>
                    <option value="10000-30000">10 000 - 30 000</option>
                    <option value="30000-50000">30 000 - 50 000</option>
                    <option value="50000-100000">50 000 - 100 000</option>
                    <option value="100000+">powyżej 100 000</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium uppercase">Preferowany rodzaj paliwa</label>
                  <select className="w-full border border-[#35530A] rounded-[2px] p-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]">
                    <option value="">Wybierz rodzaj paliwa</option>
                    <option value="petrol">Benzyna</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybryda</option>
                    <option value="electric">Elektryczny</option>
                    <option value="lpg">LPG</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dodatkowe informacje */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Dodatkowe informacje</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium uppercase">Uwagi i preferencje</label>
                <textarea 
                  className="w-full border border-[#35530A] rounded-[2px] p-2 h-32 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                  placeholder="Wprowadź dodatkowe uwagi lub preferencje dotyczące poszukiwanego samochodu..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button"
              className="px-6 py-2 border border-[#35530A] rounded-[2px] uppercase text-[#35530A] hover:bg-[#35530A] hover:text-white transition-colors"
            >
              Anuluj
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-[#35530A] text-white rounded-[2px] uppercase hover:bg-[#2a4208] transition-colors"
            >
              Zapisz zmiany
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarUserProfile;