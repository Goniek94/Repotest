import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Paperclip, Send } from 'lucide-react';
import MessagesHeader from './MessagesHeader';
import MessagesTabs from './MessagesTabs';
import MessageList from './MessageList';
import MessageChat from './MessageChat';
import EmptyChat from './EmptyChat';
import ChatHeader from './ChatHeader';
import MessageForm from './MessageForm';
import { useNotifications } from '../../../contexts/NotificationContext';
import useConversations from './hooks/useConversations';
import { useAuth } from '../../../contexts/AuthContext';
import { getAuthToken, API_URL } from '../../../services/api/config';
import { DEFAULT_FOLDER, FOLDER_MAP } from '../../../constants/messageFolders';

/**
 * Główny komponent wiadomości
 * 
 * Integruje wszystkie komponenty związane z wiadomościami
 * i zapewnia spójny interfejs użytkownika.
 */
const Messages = () => {
  debug('=== Renderowanie komponentu Messages ===');
  
  // Kontekst powiadomień i autoryzacji
  const { unreadCount } = useNotifications();
  const { isAuthenticated, user } = useAuth();
  
  debug('Stan autoryzacji:', isAuthenticated ? 'zalogowany' : 'niezalogowany');
  debug('ID użytkownika:', user?._id || user?.id);
  debug('Token JWT:', getAuthToken() ? 'dostępny' : 'brak');
  
  // Stan lokalny komponentu
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const initial = searchParams.get('folder');
    return FOLDER_MAP[initial] ? initial : DEFAULT_FOLDER;
  });
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [sendingReply, setSendingReply] = useState(false);
  
  // Referencja do inputa plików
  const fileInputRef = useRef(null);

  // Synchronizacja aktywnej zakładki z parametrem w adresie
  useEffect(() => {
    setSearchParams({ folder: activeTab });
  }, [activeTab, setSearchParams]);

  // Hook useConversations zarządzający stanem i operacjami na konwersacjach
  const { 
    conversations,
    selectedConversation,
    chatMessages,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleSearch: searchConversations,
    selectConversation,
    toggleStar,
    deleteConversation,
    moveToFolder,
    sendReply,
    showNotification
  } = useConversations(activeTab);
  
  debug('Hook useConversations - dane:', {
    'Ilość konwersacji': conversations?.length || 0,
    'Wybrana konwersacja': selectedConversation?.id || 'brak',
    'Ilość wiadomości w czacie': chatMessages?.length || 0,
    'Stan ładowania': loading ? 'ładowanie' : 'zakończone',
    'Błędy': error || 'brak',
    'Aktywna zakładka': activeTab
  });


  // Wyłączono automatyczne przewijanie czatu na koniec listy wiadomości.
  // Dzięki temu użytkownik zachowuje kontrolę nad pozycją scrolla
  // i widok nie "ucieka" do ostatniej wiadomości po każdej aktualizacji.
  
  // Efekt diagnostyczny dla testowania API
  useEffect(() => {
    debug('===== KOMPONENT MESSAGES ZAMONTOWANY =====');
    debug('Sprawdzenie stanu autoryzacji:', isAuthenticated ? 'zalogowany' : 'niezalogowany');
    debug('ID użytkownika:', user?._id || user?.id);
    debug('Token JWT:', getAuthToken() ? 'dostępny' : 'brak');
    
    // Test API - sprawdzenie, czy endpoint jest dostępny
    const testApi = async () => {
      try {
        debug('Testowanie połączenia z API wiadomości...');
        
        const headers = {};
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/messages/conversations`, {
          headers,
          credentials: 'include'
        });
        
        debug('Test API - status odpowiedzi:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          debug('Test API - Otrzymano dane:', data);
          debug('Test API - Ilość konwersacji:', Array.isArray(data) ? data.length : 'brak danych');
        } else {
          console.error('Test API - Błąd odpowiedzi:', response.statusText);
          try {
            const errorData = await response.json();
            console.error('Test API - Szczegóły błędu:', errorData);
          } catch (e) {
            console.error('Test API - Nie można sparsować błędu JSON');
          }
        }
      } catch (error) {
        console.error('Test API - Wyjątek podczas wykonywania zapytania:', error);
      }
    };
    
    if (isAuthenticated) {
      testApi();
    } else {
      debug('Test API pominięty - użytkownik niezalogowany');
    }
    
    return () => {
      debug('===== KOMPONENT MESSAGES ODMONTOWANY =====');
    };
  }, [isAuthenticated, user]);
  
  // Logowanie przy zmianie konwersacji
  useEffect(() => {
    if (conversations.length > 0) {
      debug('Pobrane konwersacje:', conversations);
    }
  }, [conversations]);
  
  useEffect(() => {
    if (selectedConversation) {
      debug('Wybrana konwersacja:', selectedConversation);
    }
  }, [selectedConversation]);
  
  useEffect(() => {
    if (chatMessages.length > 0) {
      debug('Wiadomości w konwersacji:', chatMessages);
    }
  }, [chatMessages]);

  // Obsługa wyszukiwania
  const handleSearch = (e) => {
    const query = e.target.value;
    debug('Wyszukiwanie konwersacji:', query);
    setSearchTerm(query);
    searchConversations(query);
  };

  // Obsługa wysyłania odpowiedzi
  const handleSendReply = async () => {
    if ((!replyContent.trim() && attachments.length === 0) || !selectedConversation) return;
    
    debug('Wysyłanie odpowiedzi:', {
      do: selectedConversation.id,
      treść: replyContent,
      załączniki: attachments.length
    });
    
    setSendingReply(true);
    try {
      await sendReply(replyContent, attachments);
      debug('Odpowiedź wysłana pomyślnie');
      setReplyContent('');
      setAttachments([]);
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      console.error('Szczegóły błędu:', error.response?.data || error.message);
      showNotification('Nie udało się wysłać wiadomości', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  // Obsługa dodawania załączników
  const handleAttachmentClick = () => {
    debug('Kliknięcie przycisku załączników');
    fileInputRef.current?.click();
  };

  // Obsługa wyboru plików
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    debug('Wybrano pliki:', files.length);
    
    if (files.length === 0) return;
    
    // Ograniczenie liczby załączników
    if (attachments.length + files.length > 5) {
      debug('Za dużo załączników');
      showNotification('Możesz dodać maksymalnie 5 załączników', 'warning');
      return;
    }
    
    // Ograniczenie rozmiaru plików (10MB)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      debug('Pliki za duże:', oversizedFiles.map(f => f.name));
      showNotification('Niektóre pliki są zbyt duże (maksymalny rozmiar to 10MB)', 'warning');
      return;
    }
    
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    debug('Dodano załączniki:', newAttachments);
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = ''; // Reset input
  };

  // Usuwanie załącznika
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Funkcja do przekierowania na stronę logowania
  const handleLoginRedirect = () => {
    debug('Przekierowanie do strony logowania');
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/login';
  };

  // Rendering komponentu
  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 h-[80vh] flex flex-col">
          {/* Nagłówek - widoczny tylko na desktopie */}
          <MessagesHeader 
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onNewMessage={() => setShowNewMessage(true)}
            unreadCount={unreadCount.messages}
          />
          
          {/* Zakładki folderów - dostosowane do urządzeń */}
          <MessagesTabs
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setSearchParams({ folder: tab });
            }}
            unreadCount={{
              odebrane: unreadCount.messages || 0,
              wyslane: 0,
              wazne: 0,
              archiwum: 0
            }}
          />
          
          {/* Główna zawartość */}
          <div className="flex flex-1 overflow-hidden">
            {/* Lista konwersacji (lewa kolumna) */}
            <div className="w-full md:w-2/5 border-r border-gray-200 flex flex-col overflow-hidden">
              {/* Komunikat o błędzie autoryzacji */}
              {!isAuthenticated ? (
                <div className="flex flex-col justify-center items-center h-64 p-4">
                  <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8m0 0V6m0 2h2m-2 0H9" />
                    </svg>
                    <p className="text-center font-medium text-lg">Twoja sesja wygasła. Zaloguj się ponownie, aby kontynuować.</p>
                  </div>
                  <button 
                    className="px-4 py-2 bg-[#35530A] text-white rounded-md hover:bg-[#2A4208] transition-colors"
                    onClick={handleLoginRedirect}
                  >
                    Zaloguj się
                  </button>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64 p-4 text-center text-red-500">
                  <p>{error}</p>
                </div>
              ) : loading && conversations.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex justify-center items-center h-64 p-4 text-center text-gray-500">
                  <p>Nie znaleziono wiadomości w tym folderze.</p>
                </div>
              ) : (
                <MessageList
                  messages={conversations}
                  activeConversation={selectedConversation?.id}
                  onSelectConversation={selectConversation}
                  onStar={toggleStar}
                  onDelete={deleteConversation}
                  onMove={moveToFolder}
                />
              )}
            </div>
            
            {/* Zawartość konwersacji (prawa kolumna) */}
            <div className="hidden md:flex md:w-3/5 flex-col overflow-hidden">
              {selectedConversation ? (
                <>
                  {/* Nagłówek konwersacji */}
                  <ChatHeader 
                    conversation={selectedConversation} 
                    onStar={() => toggleStar(selectedConversation.id)} 
                    onDelete={() => deleteConversation(selectedConversation.id)}
                    onArchive={() => moveToFolder(selectedConversation.id, 'archiwum')}
                    onBack={() => selectConversation(null)}
                  />
                  
                  {/* Wiadomości w konwersacji */}
                  <MessageChat
                    messages={chatMessages}
                    currentUser={user}
                    loading={loading}
                  />
                  
                  {/* Pole odpowiedzi */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {/* Lista załączników */}
                    {attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {attachments.map((file, index) => (
                          <div 
                            key={index}
                            className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center gap-1"
                          >
                            <span className="truncate max-w-[150px]">{file.name}</span>
                            <button 
                              className="text-gray-500 hover:text-red-500"
                              onClick={() => removeAttachment(index)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Pole tekstowe i przyciski */}
                    <div className="flex items-end gap-2">
                      <textarea
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent resize-none"
                        placeholder="Napisz wiadomość..."
                        rows="3"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        disabled={sendingReply}
                      />
                      <div className="flex flex-col gap-2">
                        {/* Przycisk załączników */}
                        <button
                          className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          onClick={handleAttachmentClick}
                          disabled={sendingReply}
                          title="Dodaj załącznik"
                        >
                          <Paperclip className="h-6 w-6" />
                        </button>
                        
                        {/* Przycisk wysyłania */}
                        <button
                          className="p-3 rounded-lg bg-[#35530A] text-white hover:bg-[#2A4208] transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                          onClick={handleSendReply}
                          disabled={sendingReply || (!replyContent.trim() && attachments.length === 0) || !selectedConversation}
                          title="Wyślij wiadomość"
                        >
                          {sendingReply ? (
                            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="h-6 w-6" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Ukryty input do wyboru plików */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    />
                  </div>
                </>
              ) : (
                <EmptyChat onNewMessage={() => setShowNewMessage(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal nowej wiadomości */}
      {showNewMessage && (
        <MessageForm
          onClose={() => setShowNewMessage(false)}
          onSend={() => {
            setShowNewMessage(false);
            // Odświeżenie listy konwersacji po wysłaniu nowej wiadomości
            if (activeTab === 'wyslane') {
              searchConversations('');
            }
          }}
        />
      )}
      
      {/* Miejsce na dodatkowe elementy w przyszłości */}
    </div>
  );
};

export default Messages;
