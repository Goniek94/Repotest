// ListingForm.jsx
import React from 'react';
import ListingOptions from './ListingOptions';

const ListingForm = () => {
    return (
        <div className="p-8 space-y-6 bg-white rounded-xl shadow-lg font-sans">
            {/* Tytuł ogłoszenia */}
            <div>
                <label className="block text-sm font-semibold text-gray-800">Tytuł</label>
                <input
                    type="text"
                    placeholder="Automatyczne uzupełnienie z marki, modelu, generacji, rocznika, wersji"
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm"
                />
            </div>

            {/* Nagłówek */}
            <div>
                <label className="block text-sm font-semibold text-gray-800">Nagłówek</label>
                <input
                    type="text"
                    placeholder="(Max znaków 60)"
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm"
                />
            </div>

            {/* Stan pojazdu */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">Stan pojazdu</label>
                <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="radio"
                            name="condition"
                            value="nowy"
                            className="form-radio text-green-600 focus:ring-green-600"
                        />
                        <span>Nowy</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="radio"
                            name="condition"
                            value="używany"
                            className="form-radio text-green-600 focus:ring-green-600"
                        />
                        <span>Używany</span>
                    </label>
                </div>
            </div>

            {/* Numer rejestracyjny i VIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-800">Nr rejestracyjny</label>
                    <input
                        type="text"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-800">Numer VIN</label>
                    <input
                        type="text"
                        placeholder="Wpisz VIN"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm"
                    />
                </div>
            </div>

            {/* Opcje handlowe */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">Opcje handlowe</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="checkbox"
                            name="options"
                            value="sprzedaż"
                            className="form-checkbox text-green-600 focus:ring-green-600"
                        />
                        <span>Sprzedaż</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="checkbox"
                            name="options"
                            value="zamiana"
                            className="form-checkbox text-green-600 focus:ring-green-600"
                        />
                        <span>Zamiana</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="checkbox"
                            name="options"
                            value="leasing"
                            className="form-checkbox text-green-600 focus:ring-green-600"
                        />
                        <span>Cesja Leasingu</span>
                    </label>
                </div>
            </div>

            {/* Opcje zakupu */}
            <ListingOptions />

            {/* Cena samochodu */}
            <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-800">Cena samochodu</label>
                <input
                    type="text"
                    placeholder="Cena w zł"
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm"
                />
            </div>

            {/* Koszt wystawienia ogłoszenia */}
            <div className="border-t border-gray-200 pt-4 mt-6">
                <label className="block text-sm font-semibold text-gray-800">Koszt wystawienia ogłoszenia</label>
                <p className="text-sm text-gray-600 mt-1">Standardowe: 30 zł/30 dni</p>
                <p className="text-sm text-gray-600">Wyróżnione: 50 zł/30 dni</p>
            </div>
        </div>
    );
};

export default ListingForm;
