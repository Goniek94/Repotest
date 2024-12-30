import React, { useState } from 'react';

const ProfileMessages = () => {
  const [activeMessageTab, setActiveMessageTab] = useState('przychodzace'); // Domyślnie przychodzące wiadomości
  const [messages, setMessages] = useState({
    przychodzace: [
      { id: 1, from: 'User123', content: 'Cześć, czy ogłoszenie jest nadal aktualne?', date: '2024-11-21' },
      { id: 2, from: 'User456', content: 'Chciałbym więcej informacji o produkcie.', date: '2024-11-20' },
    ],
    wyslane: [
      { id: 1, to: 'User789', content: 'Tak, ogłoszenie jest aktualne.', date: '2024-11-19' },
    ],
  });
  const [newMessage, setNewMessage] = useState({ recipient: '', content: '' });

  const handleSendMessage = () => {
    if (!newMessage.recipient || !newMessage.content) {
      alert('Wypełnij wszystkie pola, aby wysłać wiadomość.');
      return;
    }

    const newSentMessage = {
      id: messages.wyslane.length + 1,
      to: newMessage.recipient,
      content: newMessage.content,
      date: new Date().toISOString().split('T')[0],
    };

    setMessages((prev) => ({
      ...prev,
      wyslane: [...prev.wyslane, newSentMessage],
    }));

    setNewMessage({ recipient: '', content: '' });
    alert('Wiadomość została wysłana!');
  };

  const renderMessages = () => {
    const currentMessages = messages[activeMessageTab];
    if (!currentMessages || currentMessages.length === 0) {
      return <p className="text-gray-500">Brak wiadomości w tej kategorii.</p>;
    }

    return currentMessages.map((msg) => (
      <div key={msg.id} className="p-4 bg-gray-100 rounded-lg mb-2">
        <p className="text-sm text-gray-600">
          {activeMessageTab === 'przychodzace' ? `Od: ${msg.from}` : `Do: ${msg.to}`}
        </p>
        <p className="mt-2">{msg.content}</p>
        <p className="text-xs text-gray-500 mt-1">{msg.date}</p>
        {activeMessageTab === 'przychodzace' && (
          <button
            onClick={() => setNewMessage({ recipient: msg.from, content: `Re: ${msg.content}` })}
            className="mt-2 text-blue-500 text-sm underline"
          >
            Odpowiedz
          </button>
        )}
      </div>
    ));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Wiadomości</h2>

      {/* Zakładki */}
      <div className="mb-4">
        <button
          onClick={() => setActiveMessageTab('przychodzace')}
          className={`py-2 px-4 rounded-lg mr-4 ${
            activeMessageTab === 'przychodzace' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
        >
          Przychodzące
        </button>
        <button
          onClick={() => setActiveMessageTab('wyslane')}
          className={`py-2 px-4 rounded-lg mr-4 ${
            activeMessageTab === 'wyslane' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
        >
          Wysłane
        </button>
      </div>

      {/* Lista wiadomości */}
      <div className="mb-6">{renderMessages()}</div>

      {/* Formularz nowej wiadomości */}
      <h3 className="text-lg font-semibold mb-2">Napisz nową wiadomość</h3>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Odbiorca</label>
          <input
            type="text"
            placeholder="Wprowadź nazwę użytkownika"
            value={newMessage.recipient}
            onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
            className="w-full mt-2 p-3 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Treść wiadomości</label>
          <textarea
            placeholder="Wpisz swoją wiadomość"
            value={newMessage.content}
            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            className="w-full mt-2 p-3 border rounded-lg"
          />
        </div>
        <button
          type="button"
          onClick={handleSendMessage}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Wyślij wiadomość
        </button>
      </form>
    </div>
  );
};

export default ProfileMessages;
