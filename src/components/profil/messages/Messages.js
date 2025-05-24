import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import MessageList from './MessageList';
import MessageDetails from './MessageDetails';
import MessageChat from './MessageChat';
import MessagesService from '../../../services/api/messagesApi';

// Prosta funkcja powiadomień zamiast react-toastify
const showNotification = (message, type = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Można również użyć window.alert() w razie potrzeby
  // alert(`${type.toUpperCase()}: ${message}`);
};

// Main color constants
const PRIMARY_COLOR = '#35530A';
const PRIMARY_DARK = '#2A4208'; 
const PRIMARY_LIGHT = '#EAF2DE';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('odebrane');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mapowanie polskich nazw folderów na backendowe
  const folderMap = {
    'odebrane': 'inbox',
    'wyslane': 'sent',
    'robocze': 'drafts',
    'archiwum': 'archived',
    'wazne': 'starred',
    'kosz': 'trash'
  };

  // Pobieranie wiadomości
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const backendFolder = folderMap[activeTab] || 'inbox';
        const response = await MessagesService.getByFolder(backendFolder);

        // Bezpieczne formatowanie wiadomości
        let formattedMessages = [];
        if (Array.isArray(response.data)) {
          formattedMessages = response.data.map(message => ({
            id: message._id,
            sender: message.sender.name || message.sender.email,
            email: message.sender.email,
            subject: message.subject,
            content: message.content,
            date: new Date(message.createdAt).toLocaleDateString('pl-PL'),
            time: new Date(message.createdAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
            isRead: message.read,
            isStarred: message.starred,
            avatar: message.sender.avatar || '👤'
          }));
        } else {
          setError('Nie udało się pobrać wiadomości. Spróbuj ponownie później.');
        }

        setMessages(formattedMessages);
        setLoading(false);
      } catch (err) {
        console.error('Błąd podczas pobierania wiadomości:', err);
        setError('Nie udało się pobrać wiadomości. Spróbuj ponownie później.');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeTab]);
  
  // Pobieranie konwersacji po wybraniu wiadomości
  useEffect(() => {
    const fetchConversation = async () => {
      if (showChat && selectedMessage) {
        try {
          setLoading(true);
          // Pobranie konwersacji z użytkownikiem
          const response = await MessagesService.getById(selectedMessage.id);
          const conversationId = response.data.conversationId;
          
          if (conversationId) {
            const conversation = await MessagesService.getConversation(conversationId);
            
            // Formatowanie wiadomości z konwersacji
            const formattedChatMessages = conversation.data.messages.map(msg => ({
              id: msg._id,
              content: msg.content,
              timestamp: new Date(msg.createdAt).toLocaleString('pl-PL'),
              isMine: msg.sender._id === response.data.currentUserId, // Sprawdzenie czy wiadomość jest od bieżącego użytkownika
            }));
            
            setChatMessages(formattedChatMessages);
          } else {
            setChatMessages([{
              id: selectedMessage.id,
              content: selectedMessage.content,
              timestamp: `${selectedMessage.date}, ${selectedMessage.time}`,
              isMine: false
            }]);
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Błąd podczas pobierania konwersacji:', err);
          setError('Nie udało się pobrać konwersacji. Spróbuj ponownie później.');
          setLoading(false);
        }
      }
    };
    
    fetchConversation();
  }, [showChat, selectedMessage]);
  
  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    setShowChat(false);
    
    // Oznaczenie wiadomości jako przeczytana
    if (!message.isRead) {
      try {
        await MessagesService.markAsRead(message.id);
        // Aktualizacja listy wiadomości
        setMessages(messages.map(msg => 
          msg.id === message.id ? { ...msg, isRead: true } : msg
        ));
      } catch (err) {
        console.error('Błąd podczas oznaczania wiadomości jako przeczytana:', err);
      }
    }
  };
  
  const goToChat = () => {
    setShowChat(true);
  };
  
  const goBack = () => {
    if (showChat) {
      setShowChat(false);
    } else {
      setSelectedMessage(null);
    }
  };
  
  const handleSendMessage = async (content) => {
    if (!content.trim()) return;
    
    try {
      const response = await MessagesService.replyToMessage(selectedMessage.id, { content });
      
      // Dodanie nowej wiadomości do czatu
      const newMessage = {
        id: response.data._id,
        content,
        timestamp: new Date().toLocaleString('pl-PL'),
        isMine: true
      };
      
      setChatMessages([...chatMessages, newMessage]);
      showNotification('Wiadomość wysłana', 'success');
    } catch (err) {
      console.error('Błąd podczas wysyłania wiadomości:', err);
      showNotification('Nie udało się wysłać wiadomości. Spróbuj ponownie później.', 'error');
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filtrowanie wiadomości po wyszukiwaniu
  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleNewMessage = () => {
    // Implementacja zostanie dodana w przyszłości
    showNotification('Funkcja tworzenia nowej wiadomości zostanie dodana wkrótce', 'info');
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        
        {/* Main messages container */}
        <div className="bg-white rounded-sm shadow-md overflow-hidden" style={{ borderRadius: '2px' }}>
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center">
              {(selectedMessage || showChat) && (
                <button 
                  onClick={goBack}
                  className="mr-4 text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-lg font-bold text-gray-800">
                {showChat ? `Czat z ${selectedMessage?.sender}` : 'Wiadomości'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              {!showChat && (
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Szukaj..."
                    className="pl-8 pr-4 py-1 border border-gray-300 rounded-sm text-sm"
                    style={{ borderRadius: '2px' }}
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2" />
                </div>
              )}
              
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Filter className="w-5 h-5" />
              </button>
              
              <button 
                className="bg-[#35530A] text-white px-4 py-1 rounded-sm text-sm font-medium hover:bg-[#2A4208]"
                style={{ borderRadius: '2px' }}
                onClick={handleNewMessage}
              >
                Nowa wiadomość
              </button>
            </div>
          </div>

          {/* Zakładki folderów */}
          {!showChat && !selectedMessage && (
            <div className="border-b border-gray-100 flex space-x-2 px-4 pt-2 bg-white">
              {[
                { label: 'Odebrane', value: 'odebrane' },
                { label: 'Wysłane', value: 'wyslane' },
                { label: 'Ważne', value: 'wazne' },
                { label: 'Kosz', value: 'kosz' },
                { label: 'Robocze', value: 'robocze' },
                { label: 'Archiwum', value: 'archiwum' }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-t ${
                    activeTab === tab.value
                      ? 'bg-[#35530A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ borderRadius: '6px 6px 0 0' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-[600px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-[600px] text-red-500">
              <div className="text-center">
                <p>{error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
                  onClick={() => window.location.reload()}
                >
                  Odśwież
                </button>
              </div>
            </div>
          ) : !showChat ? (
            <div className="flex h-[600px]">
              {/* Message list */}
              <MessageList 
                messages={filteredMessages}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedMessage={selectedMessage}
                onMessageClick={handleMessageClick}
                toggleStar={async (id, e) => {
                  e.stopPropagation();
                  try {
                    await MessagesService.toggleStar(id);
                    setMessages(messages =>
                      messages.map(msg =>
                        msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
                      )
                    );
                  } catch (err) {
                    showNotification('Nie udało się oznaczyć gwiazdką.', 'error');
                  }
                }}
                deleteMessage={async (id, e) => {
                  e.stopPropagation();
                  try {
                    await MessagesService.delete(id);
                    setMessages(messages => messages.filter(msg => msg.id !== id));
                    showNotification('Wiadomość przeniesiona do kosza.', 'success');
                  } catch (err) {
                    showNotification('Nie udało się przenieść do kosza.', 'error');
                  }
                }}
              />
              
              {/* Message details */}
              {selectedMessage && (
                <MessageDetails 
                  message={selectedMessage}
                  onGoToChat={goToChat}
                />
              )}
            </div>
          ) : (
            /* Chat view */
            <MessageChat 
              message={selectedMessage}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
