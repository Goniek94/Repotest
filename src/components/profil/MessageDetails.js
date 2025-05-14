import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaReply, FaArrowLeft, FaPaperclip, FaTrash, FaStar } from 'react-icons/fa';
import MessagesService from '../../services/api/messagesApi';
import ProfileLayout from './ProfileLayout';
import LoadingSpinner from '../common/LoadingSpinner';

function MessageDetails() {
  const { messageId } = useParams();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // Pobieranie szczegółów wiadomości
  useEffect(() => {
    async function fetchMessageDetails() {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await MessagesService.getById(messageId);
        
        if (response.data) {
          setMessage(response.data);
          setIsStarred(response.data.starred || false);
          
          // Oznacz wiadomość jako przeczytaną, jeśli jeszcze nie jest
          if (!response.data.read) {
            await MessagesService.markAsRead(messageId);
          }
        } else {
          setError('Nie udało się pobrać szczegółów wiadomości');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania szczegółów wiadomości:', error);
        setError('Wystąpił błąd podczas pobierania wiadomości');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (messageId) {
      fetchMessageDetails();
    }
  }, [messageId]);

  // Obsługa powrotu do listy wiadomości
  const handleBackToList = () => {
    navigate('/profil/wiadomosci');
  };

  // Obsługa przełączania formularza odpowiedzi
  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  // Obsługa zmiany treści odpowiedzi
  const handleReplyContentChange = (e) => {
    setReplyContent(e.target.value);
  };

  // Obsługa dodawania załączników
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  // Usuwanie załącznika
  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  // Wysyłanie odpowiedzi
  const handleSendReply = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      alert('Wpisz treść odpowiedzi');
      return;
    }
    
    try {
      setIsSending(true);
      
      // Wysyłanie odpowiedzi przez API
      await MessagesService.reply(messageId, replyContent, attachments);
      
      // Resetuj formularz
      setReplyContent('');
      setAttachments([]);
      setShowReplyForm(false);
      
      // Pokaż powiadomienie o sukcesie
      alert('Odpowiedź została wysłana');
      
      // Przekieruj do listy wiadomości
      navigate('/profil/wiadomosci');
    } catch (error) {
      console.error('Błąd podczas wysyłania odpowiedzi:', error);
      alert('Nie udało się wysłać odpowiedzi. Spróbuj ponownie.');
    } finally {
      setIsSending(false);
    }
  };

  // Obsługa usuwania wiadomości
  const handleDeleteMessage = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę wiadomość?')) {
      return;
    }
    
    try {
      await MessagesService.delete(messageId);
      alert('Wiadomość została usunięta');
      navigate('/profil/wiadomosci');
    } catch (error) {
      console.error('Błąd podczas usuwania wiadomości:', error);
      alert('Nie udało się usunąć wiadomości');
    }
  };

  // Obsługa oznaczania gwiazdką
  const handleToggleStar = async () => {
    try {
      const response = await MessagesService.toggleStar(messageId);
      setIsStarred(response.data.starred);
    } catch (error) {
      console.error('Błąd podczas oznaczania gwiazdką:', error);
      alert('Nie udało się oznaczyć wiadomości gwiazdką');
    }
  };

  // Renderowanie formularza odpowiedzi
  const renderReplyForm = () => {
    if (!showReplyForm) return null;
    
    return (
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-medium mb-3">Odpowiedź</h3>
        
        <form onSubmit={handleSendReply}>
          <div className="mb-4">
            <textarea
              value={replyContent}
              onChange={handleReplyContentChange}
              rows={6}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Wpisz swoją odpowiedź..."
              disabled={isSending}
              required
            />
          </div>
          
          {/* Załączniki */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <FaPaperclip />
              <span>Dodaj załącznik</span>
              <input
                type="file"
                multiple
                onChange={handleAttachmentChange}
                className="hidden"
                disabled={isSending}
              />
            </label>
            
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="text-sm truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isSending}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleReplyForm}
              className="mr-2 px-4 py-2 border rounded-md"
              disabled={isSending}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
              disabled={isSending}
            >
              {isSending ? 'Wysyłanie...' : 'Wyślij odpowiedź'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Renderowanie treści wiadomości
  const renderMessageContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={handleBackToList}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
          >
            Wróć do listy wiadomości
          </button>
        </div>
      );
    }
    
    if (!message) {
      return (
        <div className="text-center py-10">
          <p>Nie znaleziono wiadomości</p>
          <button
            onClick={handleBackToList}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
          >
            Wróć do listy wiadomości
          </button>
        </div>
      );
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleBackToList}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-1" /> Wróć do listy
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStar}
              className={`p-2 rounded-full ${isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              title={isStarred ? 'Usuń gwiazdkę' : 'Oznacz gwiazdką'}
            >
              <FaStar />
            </button>
            <button
              onClick={handleDeleteMessage}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full"
              title="Usuń wiadomość"
            >
              <FaTrash />
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h1 className="text-xl font-semibold">{message.subject}</h1>
            
            <div className="mt-2 text-sm text-gray-600">
              <p>
                <strong>Od:</strong> {message.sender?.name || message.sender?.email}
              </p>
              <p>
                <strong>Do:</strong> {message.recipient?.name || message.recipient?.email}
              </p>
              <p>
                <strong>Data:</strong> {new Date(message.createdAt).toLocaleString()}
              </p>
              {message.relatedAd && (
                <p>
                  <strong>Dotyczy ogłoszenia:</strong> {
                    message.relatedAd.headline || 
                    `${message.relatedAd.brand} ${message.relatedAd.model}`
                  }
                </p>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Załączniki:</h3>
                <div className="space-y-1">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center">
                      <FaPaperclip className="mr-2 text-gray-400" />
                      <a
                        href={attachment.path}
                        download={attachment.name}
                        className="text-blue-500 hover:underline"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={toggleReplyForm}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center"
            >
              <FaReply className="mr-1" /> Odpowiedz
            </button>
          </div>
          
          {renderReplyForm()}
        </div>
      </div>
    );
  };

  return (
    <ProfileLayout title="Szczegóły wiadomości">
      <div className="bg-white shadow rounded-lg p-6">
        {renderMessageContent()}
      </div>
    </ProfileLayout>
  );
}

export default MessageDetails;
