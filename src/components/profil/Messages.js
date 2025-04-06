// src/components/profil/Messages.js

import React, { useState, useEffect } from 'react';
import {
  Mail, Search, Inbox, Send, Folder,
  Star, Trash2, Paperclip, X, AlertCircle
} from 'lucide-react';
import MessagesService from '../../services/api/messagesApi'; // Skorygowana ścieżka względna
import { useAuth } from '../../contexts/AuthContext';

function Messages() {
  const { user } = useAuth(); // przykładowy kontekst uwierzytelnienia
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Nowa wiadomość
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    attachments: []
  });

  // Pobieranie wiadomości po zmianie zakładki
  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  async function fetchMessages() {
    try {
      setIsLoading(true);
      setError('');

      // Wywołanie metody z serwisu
      const response = await MessagesService.getByFolder(activeTab);
      // Załóżmy, że serwer zwraca dane w `response.data`
      const data = response.data || [];

      setMessages(data);
    } catch (apiError) {
      console.error(apiError);
      setError('Nie udało się pobrać wiadomości');
    } finally {
      setIsLoading(false);
    }
  }

  // Otwarcie okienka tworzenia wiadomości
  function handleComposeClick(e) {
    e.preventDefault();
    setNewMessage({ to: '', subject: '', content: '', attachments: [] });
    setShowComposeModal(true);
  }

  // Zamknięcie okienka
  function handleCloseModal(e) {
    if (e) {
      e.preventDefault();
    }
    setShowComposeModal(false);
  }

  // Dodawanie załączników
  function handleAttachmentUpload(e) {
    const files = Array.from(e.target.files);
    setNewMessage((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  }

  // Usuwanie konkretnego załącznika z listy
  function handleRemoveAttachment(index) {
    setNewMessage((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  }

  // Wysyłanie wiadomości
  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.to || !newMessage.subject || !newMessage.content) {
      alert('Wypełnij wszystkie pola');
      return;
    }

    try {
      await MessagesService.send(newMessage);
      // Jeśli wysłano pomyślnie, zamknij modal
      handleCloseModal();
      // Jeśli zakładka to "sent", odśwież listę
      if (activeTab === 'sent') {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
      alert('Nie udało się wysłać wiadomości');
    }
  }

  // Zapisywanie szkicu
  async function handleSaveDraft(e) {
    e.preventDefault();
    // Jeśli wszystko puste, po prostu zamknij modal
    if (!newMessage.to && !newMessage.subject && !newMessage.content) {
      handleCloseModal();
      return;
    }

    try {
      await MessagesService.saveDraft(newMessage);
      handleCloseModal();
      // Jeżeli aktualna zakładka to "drafts", odśwież listę
      if (activeTab === 'drafts') {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
      alert('Nie udało się zapisać szkicu');
    }
  }

  // Formatowanie daty w widoku
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'Nieznana data';
    }
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* SIDEBAR */}
      <div className="w-48 bg-white border-r">
        <div className="p-3">
          <button
            onClick={handleComposeClick}
            className="w-full bg-[#35530A] hover:bg-[#2D4A06] text-white py-2 px-3 rounded-[2px] flex items-center justify-center gap-2 mb-4"
          >
            <Mail className="w-4 h-4" />
            <span>Nowa wiadomość</span>
          </button>

          <div className="space-y-1">
            {[
              { id: 'inbox', icon: Inbox, label: 'Odebrane' },
              { id: 'sent', icon: Send, label: 'Wysłane' },
              { id: 'drafts', icon: Folder, label: 'Robocze' },
              { id: 'starred', icon: Star, label: 'Oznaczone' },
              { id: 'trash', icon: Trash2, label: 'Kosz' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-[2px] ${
                  activeTab === id
                    ? 'bg-[#f5f9ee] text-[#35530A]'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Szukaj..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-2 border rounded-[2px] text-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1">
        <div className="border-b p-4">
          <h2 className="text-lg font-bold">
            {activeTab === 'inbox' && 'Odebrane'}
            {activeTab === 'sent' && 'Wysłane'}
            {activeTab === 'drafts' && 'Robocze'}
            {activeTab === 'starred' && 'Oznaczone'}
            {activeTab === 'trash' && 'Kosz'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 border-b">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-10">Ładowanie...</div>
        ) : messages.length > 0 ? (
          <div className="divide-y">
            {messages.map((msg, index) => (
              <div
                key={msg._id || `msg-${index}`}
                className={`p-3 hover:bg-gray-50 cursor-pointer ${
                  !msg.read && activeTab === 'inbox'
                    ? 'bg-blue-50 font-semibold'
                    : ''
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className={msg.starred ? 'text-yellow-500' : 'text-gray-300'}
                    >
                      <Star className="w-4 h-4" />
                    </button>

                    {activeTab === 'sent' || activeTab === 'drafts' ? (
                      <span>Do: {msg.recipient?.email || 'Brak odbiorcy'}</span>
                    ) : (
                      <span>Od: {msg.sender?.email || 'Nieznany nadawca'}</span>
                    )}

                    {!msg.read && activeTab === 'inbox' && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        Nowa
                      </span>
                    )}
                    {msg.draft && (
                      <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                        Szkic
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(msg.createdAt)}
                    </span>
                    <button className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-1">
                  <h3 className="font-medium">{msg.subject || '(Brak tematu)'}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {msg.content || '(Brak treści)'}
                  </p>
                </div>

                {msg.attachments?.length > 0 && (
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Paperclip className="w-3 h-3 mr-1" />
                    {msg.attachments.length} załącznik(ów)
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500">Brak wiadomości</p>
          </div>
        )}
      </div>

      {/* MODAL – okno pisania nowej wiadomości */}
      {showComposeModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-[2px] shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Nowa wiadomość</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage}>
              <div className="p-4 space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Do:"
                    value={newMessage.to}
                    onChange={(e) =>
                      setNewMessage((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="w-full p-2 border rounded-[2px]"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Temat:"
                    value={newMessage.subject}
                    onChange={(e) =>
                      setNewMessage((prev) => ({
                        ...prev,
                        subject: e.target.value
                      }))
                    }
                    className="w-full p-2 border rounded-[2px]"
                    required
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Treść wiadomości..."
                    value={newMessage.content}
                    onChange={(e) =>
                      setNewMessage((prev) => ({
                        ...prev,
                        content: e.target.value
                      }))
                    }
                    rows={8}
                    className="w-full p-2 border rounded-[2px] resize-none"
                    required
                  />
                </div>

                {newMessage.attachments.length > 0 && (
                  <div className="space-y-2">
                    {newMessage.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-[2px]"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-[2px] cursor-pointer w-max">
                    <Paperclip className="w-4 h-4" />
                    <span>Dodaj załącznik</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleAttachmentUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[2px]"
                >
                  Zapisz jako szkic
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#35530A] hover:bg-[#2D4A06] text-white rounded-[2px]"
                >
                  Wyślij
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;