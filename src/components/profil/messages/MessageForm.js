import React, { useState, useEffect, useRef } from 'react';
import { X, Paperclip, FileText, Image, Search, User, Download } from 'lucide-react';
import MessagesService from '../../../services/api/messages';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Komponent formularza do wysyłania nowej wiadomości
 * z obsługą załączników i wyszukiwaniem odbiorców
 */
const MessageForm = ({ onClose, onSend, initialRecipient = null, initialSubject = '' }) => {
  // Stan formularza
  const [recipient, setRecipient] = useState(initialRecipient || '');
  const [subject, setSubject] = useState(initialSubject || '');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  // Stan interfejsu
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const { user } = useAuth();
  
  // Wyszukiwanie użytkowników z opóźnieniem (debounce)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setSearchLoading(true);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      MessagesService.searchUsers(searchQuery)
        .then(response => {
          setSearchResults(response.data || []);
          setShowResults(true);
          setSearchLoading(false);
        })
        .catch(err => {
          console.error('Błąd podczas wyszukiwania użytkowników:', err);
          setSearchResults([]);
          setShowResults(false);
          setSearchLoading(false);
        });
    }, 500);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);
  
  // Obsługa kliknięcia poza listą wyników
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showResults && !event.target.closest('.search-results')) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);
  
  // Obsługa wyboru odbiorcy z listy
  const handleSelectRecipient = (selectedUser) => {
    setRecipient(selectedUser.id);
    setSearchQuery(selectedUser.name || selectedUser.email);
    setShowResults(false);
  };
  
  // Obsługa dodawania załączników
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Sprawdzenie limitu liczby załączników
    if (attachments.length + files.length > 5) {
      setError('Możesz dodać maksymalnie 5 załączników.');
      e.target.value = '';
      return;
    }
    
    // Sprawdzenie limitu rozmiaru pojedynczego pliku (10MB)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Pliki: ${oversizedFiles.map(f => f.name).join(', ')} przekraczają limit 10MB.`);
      e.target.value = '';
      return;
    }
    
    // Dodanie plików do stanu
    if (files.length > 0) {
      const newAttachments = files.map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        id: Math.random().toString(36).substring(2, 15) // Tymczasowe ID
      }));
      
      setAttachments(prev => [...prev, ...newAttachments]);
      setError(null);
    }
    
    // Reset input value
    e.target.value = '';
  };
  
  // Usuwanie załącznika
  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };
  
  // Formatowanie rozmiaru pliku
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Wysyłanie wiadomości
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Walidacja podstawowa
    if (!recipient.trim()) {
      setError('Podaj odbiorcę wiadomości.');
      return;
    }
    
    if (!subject.trim()) {
      setError('Podaj temat wiadomości.');
      return;
    }
    
    if (!content.trim()) {
      setError('Wpisz treść wiadomości.');
      return;
    }
    
    setSending(true);
    setError(null);
    
    try {
      // Przygotowanie formularza danych dla załączników
      let formData = new FormData();
      formData.append('recipient', recipient);
      formData.append('subject', subject);
      formData.append('content', content);
      
      // Dodanie załączników do formularza
      attachments.forEach((attachment) => {
        formData.append('attachments', attachment.file);
      });
      
      // Wysłanie wiadomości
      await MessagesService.send(formData);
      
      // Wywołanie callbacków
      if (onSend) onSend();
      if (onClose) onClose();
    } catch (err) {
      console.error('Błąd podczas wysyłania wiadomości:', err);
      setError('Nie udało się wysłać wiadomości. Spróbuj ponownie.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#35530A]">Nowa wiadomość</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            disabled={sending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pole odbiorcy z wyszukiwaniem */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Odbiorca</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim() === '') {
                    setRecipient('');
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
                placeholder="Wyszukaj użytkownika po nazwie lub e-mail"
                disabled={sending}
              />
              {searchLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-[#35530A] border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            
            {/* Lista wyników wyszukiwania */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto search-results">
                <ul className="py-1">
                  {searchResults.map((user) => (
                    <li 
                      key={user.id} 
                      className="px-4 py-2 hover:bg-[#35530A] hover:bg-opacity-10 cursor-pointer flex items-center"
                      onClick={() => handleSelectRecipient(user)}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#35530A] text-white flex items-center justify-center mr-2 flex-shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{user.name || 'Użytkownik'}</div>
                        <div className="text-xs text-gray-500">{user.email || user.id}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !searchLoading && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center search-results">
                <p className="text-gray-500">Nie znaleziono użytkowników</p>
              </div>
            )}
          </div>
          
          {/* Pole tematu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temat</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
              placeholder="Temat wiadomości"
              maxLength={100}
              disabled={sending}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {subject.length}/100 znaków
            </div>
          </div>
          
          {/* Pole treści */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Treść</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
              rows={6}
              placeholder="Napisz wiadomość..."
              maxLength={2000}
              disabled={sending}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/2000 znaków
            </div>
          </div>
          
          {/* Załączniki */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Załączniki</label>
              <button
                type="button"
                onClick={handleAttachmentClick}
                className="text-[#35530A] hover:text-[#2A4208] flex items-center text-sm"
                disabled={attachments.length >= 5 || sending}
              >
                <Paperclip className="w-4 h-4 mr-1" />
                Dodaj załącznik
              </button>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
            </div>
            
            {/* Lista załączników */}
            {attachments.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-md">
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id} 
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      {attachment.type.startsWith('image/') ? (
                        <Image className="w-4 h-4 text-gray-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-sm truncate max-w-[200px]">{attachment.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-gray-500 hover:text-red-500"
                      disabled={sending}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-1">
              Maksymalnie 5 załączników (max 10MB każdy)
            </div>
          </div>
          
          {/* Wyświetlanie błędów */}
          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}
          
          {/* Przyciski formularza */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={onClose}
              disabled={sending}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#35530A] text-white rounded-md hover:bg-[#2A4208] focus:outline-none focus:ring-2 focus:ring-[#35530A]"
              disabled={sending}
            >
              {sending ? (
                <span className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Wysyłanie...
                </span>
              ) : 'Wyślij wiadomość'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;