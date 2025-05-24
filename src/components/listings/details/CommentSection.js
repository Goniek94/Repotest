import React, { useState } from 'react';
import { Edit2, Flag, ThumbsUp, ThumbsDown } from 'lucide-react';
import getImageUrl from '../../../utils/responsive/getImageUrl';

const CommentSection = ({ comments = [], onAddComment, onEditComment, onSaveComment, userId, commentError }) => {
  const [newComment, setNewComment] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment, imageFile);
      setNewComment('');
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-sm">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">
        Komentarze
      </h2>
      
      {/* Lista komentarzy */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 border-l-4 rounded-sm"
            style={{
              borderColor: '#35530A',
              backgroundColor: '#F9F9F9'
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-sm text-gray-500">{comment.date}</span>
            </div>

            {comment.isEditing ? (
              <div className="mt-2">
                <textarea
                  defaultValue={comment.text}
                  className="w-full p-2 border rounded-sm focus:ring-2 focus:ring-[#35530A] focus:outline-none"
                  rows={3}
                />
                <button
                  onClick={() => onSaveComment(comment.id, comment.text)}
                  className="mt-2 bg-[#35530A] text-white px-3 py-1 rounded-sm text-sm"
                >
                  Zapisz
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-2">{comment.text}</p>
                {comment.image && (
                  <img
                    src={getImageUrl(comment.image)}
                    alt="Załączone zdjęcie"
                    className="mt-1 mb-2 max-h-40 rounded border"
                    style={{ maxWidth: "100%", objectFit: "cover" }}
                  />
                )}
              </>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              {comment.userId === userId && (
                <>
                  <button
                    onClick={() => onEditComment(comment.id)}
                    className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edytuj
                  </button>
                  <button
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      await fetch(`http://localhost:5000/api/comments/${comment.id}`, {
                        method: "DELETE",
                        headers: {
                          Authorization: token ? `Bearer ${token}` : "",
                        },
                      });
                      // Odśwież komentarze po usunięciu
                      if (typeof window !== "undefined") window.location.reload();
                    }}
                    className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    Usuń
                  </button>
                </>
              )}
              {comment.userId !== userId && (
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    await fetch(`http://localhost:5000/api/comments/${comment.id}/report`, {
                      method: "POST",
                      headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                      },
                    });
                    alert("Komentarz został zgłoszony do moderatora.");
                  }}
                  className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  <Flag className="w-4 h-4" />
                  Zgłoś
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button className="flex items-center gap-1">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <span>{comment.likes || 0}</span>
                </button>
                <button className="flex items-center gap-1">
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                  <span>{comment.dislikes || 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Bądź pierwszy, który skomentuje to ogłoszenie!
          </p>
        )}
      </div>

      {/* Formularz dodawania komentarza */}
      <div className="mt-6 space-y-4">
        {commentError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-2 rounded mb-2 font-semibold text-base">
            {commentError}
          </div>
        )}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Napisz komentarz..."
          className="w-full p-4 border rounded-sm focus:ring-2 focus:ring-[#35530A] focus:outline-none resize-none text-lg"
          rows={3}
        />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="flex flex-col items-center justify-center cursor-pointer w-full sm:w-auto">
            <span className="flex items-center gap-2 bg-[#35530A] text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-[#44671A] transition-colors text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l.4-1.2A2 2 0 017.2 4h9.6a2 2 0 011.8 1.8L21 7h2a1 1 0 011 1v11a2 2 0 01-2 2H3a2 2 0 01-2-2V8a1 1 0 011-1zm9 3a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              {imageFile ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageFile && (
              <span className="mt-2 text-xs text-gray-700 font-medium">{imageFile.name}</span>
            )}
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Podgląd"
              className="h-20 w-20 object-cover rounded border-2 border-[#35530A] shadow"
              style={{ background: "#fff" }}
            />
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleAddComment}
            className="bg-[#35530A] text-white px-8 py-2 rounded-sm hover:bg-[#2A4208] transition-colors text-lg font-semibold shadow"
          >
            Dodaj komentarz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
