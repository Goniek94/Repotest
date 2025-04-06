import React, { useState } from 'react';
import { Edit2, Flag, ThumbsUp, ThumbsDown } from 'lucide-react';

const CommentSection = ({ comments = [], onAddComment, onEditComment, onSaveComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
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
              <p className="text-gray-600">{comment.text}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              {comment.author === 'Użytkownik' && (
                <button
                  onClick={() => onEditComment(comment.id)}
                  className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edytuj
                </button>
              )}

              <button
                className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
              >
                <Flag className="w-4 h-4" />
                Zgłoś
              </button>

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
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Napisz komentarz..."
          className="w-full p-4 border rounded-sm focus:ring-2 focus:ring-[#35530A] focus:outline-none resize-none text-lg"
          rows={3}
        />

        <button
          onClick={handleAddComment}
          className="bg-[#35530A] text-white px-6 py-2 rounded-sm hover:bg-[#2A4208] transition-colors text-lg"
        >
          Dodaj komentarz
        </button>
      </div>
    </div>
  );
};

export default CommentSection;