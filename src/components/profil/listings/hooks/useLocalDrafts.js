import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Storage key for drafts
const DRAFT_STORAGE_KEY = 'auto_sell_draft_form';

/**
 * Custom hook for managing local drafts stored in localStorage
 * Handles CRUD operations for draft listings
 */
const useLocalDrafts = () => {
  const [localDrafts, setLocalDrafts] = useState([]);
  const navigate = useNavigate();

  // Get drafts from localStorage
  const getLocalDrafts = () => {
    try {
      const drafts = localStorage.getItem(DRAFT_STORAGE_KEY);
      return drafts ? JSON.parse(drafts) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania wersji roboczych:', error);
      return [];
    }
  };

  // Save drafts to localStorage
  const saveLocalDrafts = (drafts) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
      return true;
    } catch (error) {
      console.error('Błąd podczas zapisywania wersji roboczych:', error);
      toast.error('Błąd podczas zapisywania wersji roboczej.');
      return false;
    }
  };

  // Delete specific draft by index
  const deleteLocalDraft = (draftIndex) => {
    try {
      const drafts = getLocalDrafts();
      const updatedDrafts = drafts.filter((_, index) => index !== draftIndex);
      
      if (saveLocalDrafts(updatedDrafts)) {
        setLocalDrafts(updatedDrafts);
        toast.success('Wersja robocza została usunięta.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Błąd podczas usuwania wersji roboczej:', error);
      toast.error('Błąd podczas usuwania wersji roboczej.');
      return false;
    }
  };

  // Continue editing a draft
  const continueLocalDraft = (draftIndex) => {
    try {
      const drafts = getLocalDrafts();
      if (drafts[draftIndex]) {
        const draftData = { ...drafts[draftIndex] };
        
        // Remove metadata fields
        delete draftData.draftName;
        delete draftData.savedAt;
        
        // Save to temporary storage for form loading
        localStorage.setItem('auto_sell_temp_form', JSON.stringify(draftData));
        
        // Navigate to form with draft parameter
        navigate('/dodaj-ogloszenie?from=draft');
        toast.success('Wersja robocza została załadowana do formularza.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Błąd podczas ładowania wersji roboczej:', error);
      toast.error('Błąd podczas ładowania wersji roboczej.');
      return false;
    }
  };

  // Add new draft
  const addLocalDraft = (draftData) => {
    try {
      const drafts = getLocalDrafts();
      const newDraft = {
        ...draftData,
        savedAt: new Date().toISOString()
      };
      
      const updatedDrafts = [...drafts, newDraft];
      
      if (saveLocalDrafts(updatedDrafts)) {
        setLocalDrafts(updatedDrafts);
        toast.success('Wersja robocza została zapisana.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Błąd podczas dodawania wersji roboczej:', error);
      toast.error('Błąd podczas zapisywania wersji roboczej.');
      return false;
    }
  };

  // Update existing draft
  const updateLocalDraft = (draftIndex, updatedData) => {
    try {
      const drafts = getLocalDrafts();
      if (drafts[draftIndex]) {
        drafts[draftIndex] = {
          ...drafts[draftIndex],
          ...updatedData,
          savedAt: new Date().toISOString()
        };
        
        if (saveLocalDrafts(drafts)) {
          setLocalDrafts(drafts);
          toast.success('Wersja robocza została zaktualizowana.');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Błąd podczas aktualizacji wersji roboczej:', error);
      toast.error('Błąd podczas aktualizacji wersji roboczej.');
      return false;
    }
  };

  // Clear all drafts
  const clearAllDrafts = () => {
    try {
      if (saveLocalDrafts([])) {
        setLocalDrafts([]);
        toast.success('Wszystkie wersje robocze zostały usunięte.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Błąd podczas czyszczenia wersji roboczych:', error);
      toast.error('Błąd podczas czyszczenia wersji roboczych.');
      return false;
    }
  };

  // Refresh drafts from localStorage
  const refreshDrafts = () => {
    setLocalDrafts(getLocalDrafts());
  };

  // Initialize drafts on mount
  useEffect(() => {
    refreshDrafts();
  }, []);

  return {
    // State
    localDrafts,
    
    // Actions
    deleteLocalDraft,
    continueLocalDraft,
    addLocalDraft,
    updateLocalDraft,
    clearAllDrafts,
    refreshDrafts,
    getLocalDrafts,
    
    // Setters
    setLocalDrafts
  };
};

export default useLocalDrafts;
