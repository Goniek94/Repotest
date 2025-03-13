import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  Folder, 
  Star, 
  Inbox, 
  Save, 
  Flag, 
  Send, 
  Paperclip, 
  X,
  Trash2,
  AlertCircle
} from 'lucide-react';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('przychodzace');
  const [searchTerm, setSearchTerm] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    attachments: []
  });

  const [messages, setMessages] = useState({
    przychodzace: [
      { id: 1, from: 'janek123', subject: 'BMW M3 - Pytanie', date: '2024-01-15', content: 'Czy można obejrzeć auto?', isRead: false, isStarred: false },
      { id: 2, from: 'annaK', subject: 'Mercedes C63 AMG - Oferta zakupu', date: '2024-01-14', content: 'Chciałabym złożyć ofertę.', isRead: true, isStarred: true }
    ],
    wyslane: [
      { id: 3, to: 'marek90', subject: 'Re: Porsche 911 - Potwierdzenie', date: '2024-01-13', content: 'Potwierdzam termin oględzin.', isStarred: false }
    ],
    robocze: [],
    wazne: [
      { id: 5, from: 'admin@example.com', subject: 'Ważna informacja o koncie', date: '2024-01-10', content: 'Twoje konto wymaga aktualizacji...', isRead: false, isStarred: true }
    ],
    zapisane: []
  });

  const getActiveMessages = () => {
    const filtered = messages[activeTab] || [];
    if (!searchTerm) return filtered;
    return filtered.filter(msg => 
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.content && msg.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (msg.from && msg.from.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (msg.to && msg.to.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewMessage(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      }))]
    }));
  };

  const handleRemoveAttachment = (index) => {
    setNewMessage(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSendMessage = () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.content) {
      alert('Proszę wypełnić wszystkie wymagane pola');
      return;
    }
    
    const newMsg = {
      id: Date.now(),
      to: newMessage.to,
      subject: newMessage.subject,
      content: newMessage.content,
      attachments: newMessage.attachments,
      date: new Date().toISOString().split('T')[0],
      isStarred: false
    };

    setMessages(prev => ({
      ...prev,
      wyslane: [newMsg, ...prev.wyslane]
    }));
    
    setIsComposeOpen(false);
    setNewMessage({ to: '', subject: '', content: '', attachments: [] });
  };

  const handleSaveDraft = () => {
    if (!newMessage.to && !newMessage.subject && !newMessage.content) {
      return;
    }
    
    const draft = {
      id: Date.now(),
      to: newMessage.to,
      subject: newMessage.subject,
      content: newMessage.content,
      attachments: newMessage.attachments,
      date: new Date().toISOString().split('T')[0],
      isDraft: true
    };

    setMessages(prev => ({
      ...prev,
      robocze: [draft, ...prev.robocze]
    }));
    
    setIsComposeOpen(false);
    setNewMessage({ to: '', subject: '', content: '', attachments: [] });
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-6 p-6">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow-lg p-4">
        <button
          onClick={() => setIsComposeOpen(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-6 transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span>Nowa wiadomość</span>
        </button>

        <div className="space-y-1">
          {[
            { id: 'przychodzace', icon: Inbox, label: 'Przychodzące' },
            { id: 'wyslane', icon: Send, label: 'Wysłane' },
            { id: 'robocze', icon: Folder, label: 'Robocze' },
            { id: 'wazne', icon: Flag, label: 'Ważne' },
            { id: 'zapisane', icon: Save, label: 'Zapisane' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === id 
                  ? 'bg-green-100 text-green-700 font-medium' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {id === 'przychodzace' && messages.przychodzace.some(m => !m.isRead) && (
                <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {messages.przychodzace.filter(m => !m.isRead).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Szukaj..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>

        <div className="space-y-4">
          {getActiveMessages().length > 0 ? (
            getActiveMessages().map((msg) => (
              <div
                key={msg.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{msg.from || msg.to}</span>
                    {!msg.isRead && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Nowe
                      </span>
                    )}
                    {msg.isDraft && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        Robocze
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{msg.date}</span>
                </div>
                <h3 className="font-medium mb-1">{msg.subject}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{msg.content}</p>
                {msg.attachments?.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {msg.attachments.length} załącznik(i)
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Brak wiadomości
              </h3>
              <p className="text-gray-500">
                Nie znaleziono żadnych wiadomości w tej kategorii
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Nowa wiadomość</h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Do:"
                  value={newMessage.to}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Temat:"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <textarea
                  placeholder="Treść wiadomości..."
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {newMessage.attachments.length > 0 && (
                <div className="space-y-2">
                  {newMessage.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">{file.size}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                  <Paperclip className="w-5 h-5" />
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

            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Zapisz jako robocze
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Wyślij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;