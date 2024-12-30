// ListingForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListingForm = () => {
 const navigate = useNavigate();

 const [formData, setFormData] = useState({
   // Pola z excela
   title: '', // auto-uzupełniane
   headline: '', // max 60 znaków
   vin: '',
   
   // Stan pojazdu - radio buttons
   condition: '', // Nowy/Używany
   accidentStatus: '', // Bezwypadkowy/Powypadkowy
   damageStatus: '', // Nieuszkodzony/Uszkodzony
   
   // Opcje Tak/Nie
   imported: '',
   registeredInPL: '',
   firstOwner: '',
   tuning: '',
   disabledAdapted: '',

   // Nadwozie - radio button
   bodyType: '', // Hatchback, Sedan, Kombi, SUV, Coupe, Cabrio, Terenowe, Minivan, Dostawcze

   // Kolor
   color: '',

   // Dane pojazdu
   productionYear: '',
   mileage: '',
   countryOfOrigin: '',
   brand: '',
   model: '',
   generation: '',
   version: '',
   fuelType: '',
   power: '',
   engineSize: '',
   transmission: '',
   drive: '',
   doors: '',
   weight: '',

   // Lokalizacja
   voivodeship: '',
   city: ''
 });

 // Handle form changes
 const handleChange = (field, value) => {
   setFormData(prev => ({
     ...prev,
     [field]: value
   }));
 };

 // Obsługa wyszukiwania VIN
 const handleVinSearch = () => {
   // Tutaj będzie logika VIN
   console.log('Szukanie VIN:', formData.vin);
 };

 return (
   <form className="bg-white p-6 rounded-lg shadow">
     {/* Auto-uzupełniany tytuł */}
     <div className="mb-4">
       <input
         type="text"
         disabled
         value={formData.title}
         placeholder="Automatyczne uzupełnianie z tabelki: marka, model, generacja (bez roku), wersja"
         className="w-full p-2 border rounded bg-gray-50"
       />
     </div>

     {/* Nagłówek */}
     <div className="mb-4">
       <div className="flex">
         <label className="w-32 font-bold">Nagłówek:</label>
         <input
           type="text"
           value={formData.headline}
           onChange={(e) => handleChange('headline', e.target.value)}
           maxLength={60}
           placeholder="(Max znaków 60)"
           className="flex-1 p-2 border rounded"
         />
       </div>
     </div>

     {/* Wyszukiwanie VIN */}
     <div className="mb-6">
       <h3 className="bg-gray-200 p-2">Wyszukaj samochód po numerze VIN lub numerze rejestracyjnym</h3>
       <div className="flex gap-2 mt-2">
         <input
           type="text"
           value={formData.vin}
           onChange={(e) => handleChange('vin', e.target.value)}
           placeholder="Wprowadź numer VIN"
           className="flex-1 p-2 border rounded"
         />
         <button
           type="button"
           onClick={handleVinSearch}
           className="bg-green-500 text-white px-4 py-2 rounded"
         >
           Wyszukaj
         </button>
       </div>
     </div>

     {/* Stan pojazdu */}
     <div className="mb-6">
       <h3 className="bg-gray-200 p-2">Stan pojazdu:</h3>
       <div className="grid grid-cols-6 gap-4 mt-3">
         <label className="text-center">
           <input
             type="radio"
             name="condition"
             value="Nowy"
             checked={formData.condition === 'Nowy'}
             onChange={(e) => handleChange('condition', e.target.value)}
           />
           <span>Nowy</span>
         </label>
         <label className="text-center">
           <input
             type="radio"
             name="condition"
             value="Używany"
             checked={formData.condition === 'Używany'}
             onChange={(e) => handleChange('condition', e.target.value)}
           />
           <span>Używany</span>
         </label>
         <label className="text-center">
           <input
             type="radio"
             name="accidentStatus"
             value="Bezwypadkowy"
             checked={formData.accidentStatus === 'Bezwypadkowy'}
             onChange={(e) => handleChange('accidentStatus', e.target.value)}
           />
           <span>Bezwypadkowy</span>
         </label>
         <label className="text-center">
           <input
             type="radio"
             name="accidentStatus"
             value="Powypadkowy"
             checked={formData.accidentStatus === 'Powypadkowy'}
             onChange={(e) => handleChange('accidentStatus', e.target.value)}
           />
           <span>Powypadkowy</span>
         </label>
         <label className="text-center">
           <input
             type="radio"
             name="damageStatus"
             value="Nieuszkodzony"
             checked={formData.damageStatus === 'Nieuszkodzony'}
             onChange={(e) => handleChange('damageStatus', e.target.value)}
           />
           <span>Nieuszkodzony</span>
         </label>
         <label className="text-center">
           <input
             type="radio"
             name="damageStatus"
             value="Uszkodzony"
             checked={formData.damageStatus === 'Uszkodzony'}
             onChange={(e) => handleChange('damageStatus', e.target.value)}
           />
           <span>Uszkodzony</span>
         </label>
       </div>

       {/* Opcje Tak/Nie */}
       <div className="grid grid-cols-2 gap-4 mt-4">
         {[
           { label: 'Importowany', field: 'imported' },
           { label: 'Zarejestrowany w PL', field: 'registeredInPL' },
           { label: 'Pierwszy właściciel', field: 'firstOwner' },
           { label: 'Tuning', field: 'tuning' }
         ].map(option => (
           <div key={option.field} className="border p-2">
             <h4 className="font-bold">{option.label}</h4>
             <div className="flex gap-4">
               <label>
                 <input
                   type="radio"
                   name={option.field}
                   value="Tak"
                   checked={formData[option.field] === 'Tak'}
                   onChange={(e) => handleChange(option.field, e.target.value)}
                 /> Tak
               </label>
               <label>
                 <input
                   type="radio"
                   name={option.field}
                   value="Nie"
                   checked={formData[option.field] === 'Nie'}
                   onChange={(e) => handleChange(option.field, e.target.value)}
                 /> Nie
               </label>
             </div>
           </div>
         ))}

         <div className="col-span-2 border p-2">
           <h4 className="font-bold">Auto przystosowane pod osobę niepełnosprawną</h4>
           <div className="flex gap-4">
             <label>
               <input
                 type="radio"
                 name="disabledAdapted"
                 value="Tak"
                 checked={formData.disabledAdapted === 'Tak'}
                 onChange={(e) => handleChange('disabledAdapted', e.target.value)}
               /> Tak
             </label>
             <label>
               <input
                 type="radio"
                 name="disabledAdapted"
                 value="Nie"
                 checked={formData.disabledAdapted === 'Nie'}
                 onChange={(e) => handleChange('disabledAdapted', e.target.value)}
               /> Nie
             </label>
           </div>
         </div>
       </div>
     </div>

     {/* Nadwozie */}
     <div className="mb-6">
       <h3 className="bg-gray-200 p-2">Nadwozie</h3>
       <div className="grid grid-cols-3 gap-4 mt-3">
         {[
           'Hatchback', 'Sedan', 'Kombi', 'SUV', 'Coupe',
           'Cabrio', 'Terenowe', 'Minivan', 'Dostawcze'
         ].map(type => (
           <label key={type} className="flex items-center gap-2">
             <input
               type="radio"
               name="bodyType"
               value={type}
               checked={formData.bodyType === type}
               onChange={(e) => handleChange('bodyType', e.target.value)}
             />
             {type}
           </label>
         ))}
       </div>
     </div>

     {/* Dane pojazdu */}
     <div className="mb-6">
       <h3 className="bg-gray-200 p-2">Dane pojazdu</h3>
       <div className="grid grid-cols-3 gap-4 mt-3">
         <div>
           <label>Rok produkcji</label>
           <input
             type="number"
             value={formData.productionYear}
             onChange={(e) => handleChange('productionYear', e.target.value)}
             className="w-full p-2 border rounded"
           />
         </div>
         <div>
           <label>Przebieg</label>
           <input
             type="number"
             value={formData.mileage}
             onChange={(e) => handleChange('mileage', e.target.value)}
             className="w-full p-2 border rounded"
           />
         </div>
         <div>
           <label>Kraj pochodzenia</label>
           <input
             type="text"
             value={formData.countryOfOrigin}
             onChange={(e) => handleChange('countryOfOrigin', e.target.value)}
             className="w-full p-2 border rounded"
           />
         </div>
         
         {/* Pola wymagane */}
         {[
           { label: 'Marka', field: 'brand' },
           { label: 'Model', field: 'model' },
           { label: 'Generacja', field: 'generation' },
           { label: 'Wersja', field: 'version' }
         ].map(field => (
           <div key={field.field}>
             <label>{field.label}*</label>
             <input
               type="text"
               value={formData[field.field]}
               onChange={(e) => handleChange(field.field, e.target.value)}
               required
               className="w-full p-2 border rounded"
             />
           </div>
         ))}
         
         {/* Parametry techniczne */}
         {[
           { label: 'Rodzaj paliwa', field: 'fuelType' },
           { label: 'Moc', field: 'power' },
           { label: 'Pojemność', field: 'engineSize' },
           { label: 'Skrzynia biegów', field: 'transmission' }
         ].map(field => (
           <div key={field.field}>
             <label>{field.label}*</label>
             <input
               type="text"
               value={formData[field.field]}
               onChange={(e) => handleChange(field.field, e.target.value)}
               required
               className="w-full p-2 border rounded"
             />
           </div>
         ))}
       </div>
     </div>

     {/* Lokalizacja */}
     <div className="mb-6">
       <h3 className="bg-gray-200 p-2">Lokalizacja:</h3>
       <div className="grid grid-cols-2 gap-4 mt-3">
         <div>
           <label>Województwo</label>
           <select
             value={formData.voivodeship}
             onChange={(e) => handleChange('voivodeship', e.target.value)}
             className="w-full p-2 border rounded"
           >
             <option value="">Wybierz województwo</option>
             {[
               'Dolnośląskie', 'Kujawsko-pomorskie', 'Lubelskie',
               'Lubuskie', 'Łódzkie', 'Małopolskie', 'Mazowieckie',
               'Opolskie', 'Podkarpackie', 'Podlaskie', 'Pomorskie',
               'Śląskie', 'Świętokrzyskie', 'Warmińsko-mazurskie',
               'Wielkopolskie', 'Zachodniopomorskie'
             ].map(woj => (
               <option key={woj} value={woj}>{woj}</option>
             ))}
           </select>
         </div>
         <div>
           <label>Miejscowość</label>
           <input
             type="text"
             value={formData.city}
             onChange={(e) => handleChange('city', e.target.value)}
             className="w-full p-2 border rounded"
           />
         </div>
       </div>
     </div>

     <div className="flex justify-end">
       <button
         type="button"
         onClick={() => navigate('/preview')}
         className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
       >
         Dalej
       </button>
     </div>
   </form>
 );
};

export default ListingForm;