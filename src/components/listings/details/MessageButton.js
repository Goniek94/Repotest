import React, { useState } from "react";
import { Mail } from "lucide-react";
import MessagesService from "../../../services/api/messagesApi";

/**
 * MessageButton component allows sending a message to the listing owner.
 * @param {Object} props
 * @param {Object} props.listing - Listing object containing owner, ownerName, _id.
 */
const MessageButton = ({ listing }) => {
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setStatus({ type: "error", msg: "Musisz być zalogowany, aby wysłać wiadomość." });
      return;
    }
    setLoading(true);
    setStatus(null);

    try {
      await MessagesService.sendToAd(listing._id, {
        recipient: listing.owner, // odbiorca to właściciel ogłoszenia
        adId: listing._id,
        subject,
        content,
      });

      setStatus({ type: "success", msg: "Wiadomość została wysłana!" });
      setSubject("");
      setContent("");
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Błąd wysyłki." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 hover:bg-gray-200 transition-colors text-lg rounded-sm mb-2"
      >
        <Mail className="w-6 h-6" />
        Napisz wiadomość
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white p-8 w-full max-w-md mx-4 rounded-lg shadow-lg border border-[#e0e0e0]">
            <h3 className="text-2xl font-bold mb-6 text-center text-[#35530A]">
              Napisz wiadomość do <span className="text-black">{listing.ownerName || "sprzedającego"}</span>
            </h3>
            <form className="space-y-5" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Temat"
                className="w-full p-3 border border-[#cbe3c0] rounded-md focus:ring-2 focus:ring-[#35530A] focus:outline-none text-lg bg-[#f7f8f9] placeholder-gray-400"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={loading}
              />
              <textarea
                placeholder="Treść wiadomości"
                rows={4}
                className="w-full p-3 border border-[#cbe3c0] rounded-md focus:ring-2 focus:ring-[#35530A] focus:outline-none resize-none text-lg bg-[#f7f8f9] placeholder-gray-400"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={loading}
              />
              {status && (
                <div
                  className={`text-center text-lg ${
                    status.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status.msg}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#35530A] text-white py-3 rounded-md hover:bg-[#44671A] transition-colors text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? "Wysyłanie..." : "Wyślij"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-md hover:bg-gray-200 transition-colors text-lg font-semibold"
                  disabled={loading}
                >
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageButton;
