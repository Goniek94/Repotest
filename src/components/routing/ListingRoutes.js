import React from 'react';
import { ListingFormProvider } from '../../contexts/ListingFormContext';
import CreateListingForm from '../ListingForm/CreateListingForm';
import AddListingView from '../ListingForm/AddListingView';
import EditListingView from '../ListingForm/EditListingView';

/**
 * Komponent opakowania dla formularza tworzenia ogłoszenia
 * Zapewnia kontekst formularza ogłoszenia
 * 
 * @returns {React.ReactNode} - Komponent formularza tworzenia ogłoszenia
 */
export const CreateListingWithProvider = () => (
  <ListingFormProvider>
    <CreateListingForm />
  </ListingFormProvider>
);

/**
 * Komponent opakowania dla podglądu ogłoszenia
 * Zapewnia kontekst formularza ogłoszenia
 * 
 * @returns {React.ReactNode} - Komponent podglądu ogłoszenia
 */
export const AddListingViewWithProvider = () => (
  <ListingFormProvider>
    <AddListingView />
  </ListingFormProvider>
);

/**
 * Komponent opakowania dla edycji ogłoszenia
 * Zapewnia kontekst formularza ogłoszenia
 * 
 * @returns {React.ReactNode} - Komponent edycji ogłoszenia
 */
export const EditListingViewWithProvider = () => (
  <ListingFormProvider>
    <EditListingView />
  </ListingFormProvider>
);
