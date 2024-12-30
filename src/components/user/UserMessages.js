import React, { useState } from 'react';

const UserMessages = () => {
  const [messages, setMessages] = useState([
    {
      id: 101,
      fromUser: 'janek123',
      toUser: 'mojekonto',
      subject: 'Pytanie o BMW M3 2019',
      date: '2024-01-05',
      body: 'Dzień dobry,\n\nJestem zainteresowany Pana BMW M3 z 2019 roku. Chciałbym się dowiedzieć:\n- Czy cena jest do negocjacji?\n- Jaki jest rzeczywisty przebieg?\n- Czy auto było serwisowane w ASO?\n- Czy możliwe jest spotkanie w weekend?\n\nPozdrawiam,\nJan Kowalski',
      folder: 'inbox',
      isRead: false,
    },
    {
      id: 102,
      fromUser: 'annaK',
      toUser: 'mojekonto',
      subject: 'Mercedes C63 AMG - oferta',
      date: '2024-01-04',
      body: 'Witam,\n\nOglądałam Pana ogłoszenie Mercedes C63 AMG. Auto wygląda świetnie, ale mam kilka pytań:\n1. Czy auto miało jakieś naprawy blacharskie?\n2. Jak wygląda historia serwisowa?\n3. Czy jest możliwość sprawdzenia w ASO?\n4. Czy cena jest do negocjacji przy szybkiej decyzji?\n\nZ poważaniem,\nAnna Kwiatkowska',
      folder: 'inbox',
      isRead: true,
    },
    {
      id: 103,
      fromUser: 'mojekonto',
      toUser: 'dragonman',
      subject: 'Audi RS6 - pytanie o stan',
      date: '2024-01-02',
      body: 'Witam,\n\nZainteresowało mnie Pana Audi RS6. Proszę o informacje:\n- Jaki jest dokładny przebieg?\n- Czy auto jest bezwypadkowe?\n- Czy możliwe jest spotkanie w tym tygodniu?\n\nPozdrawiam,\nTomasz',
      folder: 'sent',
      isRead: true,
    },
    {
      id: 104,
      fromUser: 'mojekonto',
      toUser: 'janek123',
      subject: 'Re: Pytanie o BMW M3 2019',
      date: '2024-01-05',
      body: 'Dzień dobry,\n\nDziękuję za zainteresowanie. Odpowiadając na Pana pytania:\n1. Przy przyzwoitej ofercie cena jest do negocjacji\n2. Przebieg to dokładnie 78,500 km\n3. Tak, auto serwisowane tylko w ASO BMW, posiadam pełną dokumentację\n4. Tak, możemy się spotkać w sobotę\n\nProszę o kontakt telefoniczny: 555-xxx-xxx\n\nPozdrawiam,\nTomasz',
      folder: 'sent',
      isRead: true,
    },
    {
      id: 105,
      fromUser: 'mojekonto',
      toUser: '',
      subject: 'Zapytanie o Porsche 911',
      date: '2024-01-06',
      body: 'Dzień dobry,\n\nZainteresowało mnie Pana Porsche 911. Chciałbym zapytać o...',
      folder: 'draft',
      isRead: true,
    },
  ]);

  const [activeFolder, setActiveFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    toUser: '',
    subject: '',
    body: '',
  });

  const filteredMessages = messages.filter((msg) => {
    if (msg.folder !== activeFolder) return false;
    const q = searchQuery.toLowerCase();
    return (
      msg.fromUser.toLowerCase().includes(q) ||
      msg.toUser.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q)
    );
  });

  const selectedMessage = messages.find((msg) => msg.id === selectedMessageId);

  const handleSendMessage = () => {
    const newId = Math.floor(Math.random() * 10000);
    const newMsg = {
      id: newId,
      fromUser: 'mojekonto',
      toUser: composeData.toUser,
      subject: composeData.subject,
      date: new Date().toISOString().split('T')[0],
      body: composeData.body,
      folder: 'sent',
      isRead: true,
    };
    setMessages([...messages, newMsg]);
    setComposeData({ toUser: '', subject: '', body: '' });
    setIsComposing(false);
    setActiveFolder('sent');
    setSelectedMessageId(newId);
  };

  const startNewMessage = () => {
    setIsComposing(true);
    setSelectedMessageId(null);
    setComposeData({ toUser: '', subject: '', body: '' });
  };

  const replyToMessage = (msg) => {
    setIsComposing(true);
    setComposeData({
      toUser: msg.fromUser,
      subject: `Re: ${msg.subject}`,
      body: `\n\n--- Oryginalna wiadomość ---\n${msg.body}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-[2px] flex border border-[#35530A]"
        style={{ minHeight: '600px' }}
      >
        {/* LEWY PANEL */}
        <div className="w-1/4 border-r border-[#35530A] flex flex-col">
          <div className="bg-[#35530A] text-white p-4 rounded-tl-[2px]">
            <h2 className="text-xl font-bold uppercase">Wiadomości</h2>
          </div>

          <div className="p-4 space-y-2 border-b border-[#35530A]">
            {[
              { key: 'inbox', label: 'Przychodzące', count: messages.filter(m => m.folder === 'inbox' && !m.isRead).length },
              { key: 'sent', label: 'Wysłane', count: 0 },
              { key: 'draft', label: 'Robocze', count: messages.filter(m => m.folder === 'draft').length },
              { key: 'trash', label: 'Kosz', count: 0 },
            ].map((folder) => (
              <button
                key={folder.key}
                className={`block w-full text-left px-3 py-2 rounded-[2px] hover:bg-[#35530A] hover:text-white font-semibold transition-colors
                  ${activeFolder === folder.key ? 'bg-[#35530A] text-white' : 'bg-white text-[#35530A]'}
                `}
                onClick={() => {
                  setActiveFolder(folder.key);
                  setSelectedMessageId(null);
                  setIsComposing(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <span>{folder.label}</span>
                  {folder.count > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {folder.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-b border-[#35530A]">
            <input
              type="text"
              placeholder="Szukaj..."
              className="w-full border border-[#35530A] rounded-[2px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="p-4">
            <button
              className="bg-[#35530A] text-white w-full px-3 py-2 rounded-[2px] hover:bg-[#2a4208] transition-colors uppercase"
              onClick={startNewMessage}
            >
              Nowa wiadomość
            </button>
          </div>
        </div>

        {/* ŚRODKOWA KOLUMNA */}
        <div className="w-1/3 border-r border-[#35530A] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <p className="text-gray-500 p-4">Brak wiadomości w tym folderze.</p>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 border-b border-[#35530A] cursor-pointer hover:bg-[#35530A] hover:text-white transition-colors
                    ${selectedMessageId === msg.id ? 'bg-[#35530A] text-white' : ''} 
                    ${!msg.isRead && msg.folder === 'inbox' ? 'font-bold' : ''}`}
                  onClick={() => {
                    setSelectedMessageId(msg.id);
                    setIsComposing(false);
                    if (!msg.isRead) {
                      const updatedMessages = messages.map(m => 
                        m.id === msg.id ? {...m, isRead: true} : m
                      );
                      setMessages(updatedMessages);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-semibold">
                      {activeFolder === 'sent' ? msg.toUser : msg.fromUser}
                    </div>
                    <div className="text-xs opacity-75">{msg.date}</div>
                  </div>
                  <div className="text-sm mt-1">{msg.subject}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PRAWA KOLUMNA */}
        <div className="w-5/12 flex flex-col">
          {isComposing ? (
            <div className="flex-1 flex flex-col p-4">
              <h3 className="text-lg font-bold mb-4">Nowa wiadomość</h3>

              <label className="text-sm font-semibold mb-1">Do:</label>
              <input
                type="text"
                className="border border-[#35530A] rounded-[2px] px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                value={composeData.toUser}
                onChange={(e) => setComposeData({ ...composeData, toUser: e.target.value })}
              />

              <label className="text-sm font-semibold mb-1">Temat:</label>
              <input
                type="text"
                className="border border-[#35530A] rounded-[2px] px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                value={composeData.subject}
                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
              />

              <label className="text-sm font-semibold mb-1">Treść:</label>
              <textarea
                className="border border-[#35530A] rounded-[2px] px-3 py-2 mb-3 h-64 focus:outline-none focus:ring-1 focus:ring-[#35530A]"
                value={composeData.body}
                onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
              />

              <div className="mt-auto flex gap-2">
                <button
                  onClick={handleSendMessage}
                  className="bg-[#35530A] text-white px-6 py-2 rounded-[2px] hover:bg-[#2a4208] transition-colors uppercase"
                >
                  Wyślij
                </button>
                <button
                  onClick={() => setIsComposing(false)}
                  className="border border-[#35530A] text-[#35530A] px-6 py-2 rounded-[2px] hover:bg-[#35530A] hover:text-white transition-colors uppercase"
                >
                  Anuluj
                </button>
              </div>
            </div>
          ) : selectedMessage ? (
            <div className="flex-1 flex flex-col p-4">
              <h3 className="text-lg font-bold mb-2">{selectedMessage.subject}</h3>
              <div className="text-sm text-gray-600 mb-1">
                {activeFolder === 'sent' ? (
                  <>
                    Do: <strong>{selectedMessage.toUser}</strong> — {selectedMessage.date}
                  </>
                ) : (
                  <>
                    Od: <strong>{selectedMessage.fromUser}</strong> — {selectedMessage.date}
                  </>
                )}
              </div>
              <div className="text-sm border-t border-[#35530A] pt-4 mt-2 flex-1 whitespace-pre-line">
                {selectedMessage.body}
              </div>

              <div className="mt-4">
                {activeFolder !== 'draft' && (
                  <button
                    className="bg-[#35530A] text-white px-6 py-2 rounded-[2px] hover:bg-[#2a4208] transition-colors uppercase"
                    onClick={() => replyToMessage(selectedMessage)}
                  >
                    Odpowiedz
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 text-gray-500 italic">
              Wybierz wiadomość z listy lub kliknij "Nowa wiadomość".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMessages;