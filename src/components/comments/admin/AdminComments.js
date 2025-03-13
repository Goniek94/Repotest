import React, { useState } from 'react';

const AdminComments = () => {
  const [comments, setComments] = useState([
    { 
      id: 1, 
      author: 'Jan Kowalski', 
      content: 'Świetne ogłoszenie!', 
      date: '2024-01-15', 
      status: 'pending'
    },
    { 
      id: 2, 
      author: 'Anna Nowak', 
      content: 'Kiedy można obejrzeć?', 
      date: '2024-01-16', 
      status: 'pending'
    },
    { 
      id: 3, 
      author: 'Piotr Wiśniewski', 
      content: 'Cena do negocjacji?', 
      date: '2024-01-16', 
      status: 'active'
    },
    { 
      id: 4, 
      author: 'Marta Kowalczyk', 
      content: 'Lokalizacja super!', 
      date: '2024-01-17', 
      status: 'active'
    }
  ]);

  // Funkcja do zatwierdzania komentarza
  const handleApprove = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: 'active' }
        : comment
    ));
  };

  // Funkcja do usuwania komentarza
  const handleDelete = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  // Funkcja do określania koloru statusu
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Zarządzanie Komentarzami</h2>
        <div className="flex gap-2">
          <span className="text-sm text-gray-600">
            Łącznie komentarzy: {comments.length}
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Treść
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {comments.map(comment => (
              <tr key={comment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {comment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {comment.author}
                </td>
                <td className="px-6 py-4">
                  {comment.content}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {comment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`${getStatusColor(comment.status)} font-medium`}>
                    {comment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {comment.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Zatwierdź
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Brak komentarzy do wyświetlenia
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;