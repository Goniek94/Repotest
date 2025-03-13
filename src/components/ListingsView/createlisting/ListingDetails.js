import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Facebook, MessageCircle, Flag,
  Edit2, Heart, ChevronLeft, ChevronRight, X,
  ThumbsUp, ThumbsDown, Image as ImageIcon, Medal
} from 'lucide-react';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState(null);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Jan Kowalski',
      text: 'Świetny samochód, miałem okazję oglądać na żywo. Polecam!',
      date: '2024-03-01',
      isEditing: false,
      likes: 0,
      dislikes: 0,
      image: null
    },
    {
      id: 2,
      author: 'Anna Nowak',
      text: 'Czy możliwe jest negocjowanie ceny?',
      date: '2024-03-02',
      isEditing: false,
      likes: 0,
      dislikes: 0,
      image: '/images/car-2616096_640.jpg'
    }
  ]);

  const listing = {
    id,
    title: 'BMW 320d xDrive',
    price: '45 000 zł',
    images: [
      '/images/auto-788747_1280.jpg',
      '/images/automobile-1834278_640.jpg',
      '/images/car-932455_1920.jpg',
      '/images/car-1880381_640.jpg',
      '/images/car-2616096_640.jpg',
      '/images/challenger-5880009_1920.jpg',
      '/images/dodge-challenger-8214392_640.jpg',
      '/images/dodge-challenger-8214392_1280.jpg',
      '/images/dodge-challenger-8214392_1920.jpg',
      '/images/mercedes-benz-841465_1920.jpg',
      '/images/road-6745746_1920.jpg',
      '/images/toyota-gr-yaris-6751752_640.jpg'
    ],
    details: {
      Marka: 'BMW',
      Model: '3',
      Generacja: 'G20',
      'Wersja modelu': '320d xDrive',
      Rok: '2021',
      Przebieg: '45 000 km',
      Paliwo: 'Diesel',
      'Pojemność silnika': '1995 cm³',
      Moc: '190 KM',
      'Skrzynia biegów': 'Automatyczna',
      Napęd: '4x4 (xDrive)',
      'Typ nadwozia': 'Sedan',
      Kolor: 'Biały metalik',
      'Liczba drzwi': '4',
      'Liczba miejsc': '5',
      'Stan techniczny': 'Bezwypadkowy',
      'Kraj pochodzenia': 'Niemcy',
      VIN: 'WBA5R11070FH****',
      'Pierwsza rejestracja': '01.2021'
    },
    location: {
      region: 'Mazowieckie',
      city: 'Warszawa'
    },
    contact: {
      phone: '+48 123 456 789',
      email: 'sprzedawca@example.com'
    },
    description: `BMW 320d xDrive w idealnym stanie technicznym i wizualnym.
Auto serwisowane wyłącznie w ASO BMW, pełna historia serwisowa.

Silnik 2.0 diesel o mocy 190 KM pracuje perfekcyjnie, bardzo dynamiczny przy
zachowaniu ekonomicznego spalania (5.5-6.5l/100km w trasie).
Automatyczna skrzynia biegów i napęd xDrive działają bez zarzutu.

Wyposażenie:
- Pakiet sportowy M
- Adaptacyjne zawieszenie
- LED Matrix
- Head-up display
- Live Cockpit Professional
- System asystujący kierowcy Professional
- Asystent parkowania Plus
- Klimatyzacja 3-strefowa
- Podgrzewane fotele
- System bezkluczykowy
- Czujniki parkowania przód/tył
- Kamera 360 stopni

Auto bezwypadkowe, wszystkie elementy w oryginalnym lakierze.
Możliwość sprawdzenia w dowolnym ASO lub niezależnym serwisie.

Zapraszam na oględziny i jazdę próbną.`
  };

  const similarListings = [
    {
      id: 1,
      title: 'BMW 330i xDrive',
      price: '189 900 zł',
      year: '2022',
      mileage: '35 000 km',
      image: '/images/car-1880381_640.jpg'
    },
    {
      id: 2,
      title: 'Audi A4 40 TDI quattro',
      price: '179 000 zł',
      year: '2021',
      mileage: '48 000 km',
      image: '/images/car-1880381_640.jpg'
    },
    {
      id: 3,
      title: 'Mercedes C220d 4MATIC',
      price: '185 000 zł',
      year: '2021',
      mileage: '42 000 km',
      image: '/images/car-1880381_640.jpg'
    }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCommentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCommentImage(null);
    setCommentImagePreview(null);
  };

  const handleAddComment = () => {
    if (newComment.trim() || commentImage) {
      const comment = {
        id: comments.length + 1,
        author: 'Użytkownik',
        text: newComment,
        date: new Date().toISOString().split('T')[0],
        isEditing: false,
        likes: 0,
        dislikes: 0,
        image: commentImagePreview
      };
      setComments([...comments, comment]);
      setNewComment('');
      setCommentImage(null);
      setCommentImagePreview(null);
    }
  };

  const handleEditComment = (commentId) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId && comment.author === 'Użytkownik') {
          return { ...comment, isEditing: !comment.isEditing };
        }
        return comment;
      })
    );
  };

  const handleSaveComment = (commentId, newText) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, text: newText, isEditing: false }
          : comment
      )
    );
  };

  const handleUpvote = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleDownvote = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, dislikes: comment.dislikes + 1 }
          : comment
      )
    );
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev > 0 ? prev - 1 : listing.images.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev < listing.images.length - 1 ? prev + 1 : 0
    );
  };

  const openPhotoModal = (index) => {
    setPhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
  };

  const nextPhoto = () => {
    setPhotoIndex((prev) =>
      prev < listing.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) =>
      prev > 0 ? prev - 1 : listing.images.length - 1
    );
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'messenger':
        window.open(`https://www.facebook.com/dialog/send?link=${url}`);
        break;
      case 'email':
        window.open(
          `mailto:?subject=${encodeURIComponent(listing.title)}&body=${url}`
        );
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPhotoModalOpen) {
        closePhotoModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPhotoModalOpen]);

  const MessageModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <div className="relative bg-white p-6 w-full max-w-md mx-4 rounded-sm">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Napisz wiadomość
          </h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Temat"
              className="w-full p-3 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:outline-none text-lg"
            />
            <textarea
              placeholder="Treść wiadomości"
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:outline-none resize-none text-lg"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-3 rounded-sm hover:bg-gray-800 transition-colors text-lg"
              >
                Wyślij
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-sm hover:bg-gray-200 transition-colors text-lg"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%]">
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={closePhotoModal}
          />
          <div className="relative text-center max-w-5xl w-full mx-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={closePhotoModal}
              title="Zamknij (Esc)"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={prevPhoto}
                className="bg-white/90 p-2 hover:bg-white transition-colors rounded-sm"
                title="Poprzednie zdjęcie"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <img
                src={listing.images[photoIndex]}
                alt={`Zdjęcie powiększone ${photoIndex + 1}`}
                className="max-h-[85vh] w-auto mx-4 rounded-sm"
              />
              <button
                onClick={nextPhoto}
                className="bg-white/90 p-2 hover:bg-white transition-colors rounded-sm"
                title="Następne zdjęcie"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
            <div className="text-white mt-4 text-sm">
              Zdjęcie {photoIndex + 1} z {listing.images.length}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 font-bold text-xl text-black hover:text-gray-700 transition-colors"
      >
        ← Powrót do ogłoszeń
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[60%] space-y-8">
            {/* Galeria zdjęć */}
            <div className="bg-white p-4 shadow-md rounded-sm">
              <div className="relative aspect-video mb-4">
                <img
                  src={listing.images[selectedImage]}
                  alt={`Główne zdjęcie ${selectedImage + 1}`}
                  className="w-full h-full object-cover rounded-sm cursor-pointer"
                  onClick={() => openPhotoModal(selectedImage)}
                />
                <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="bg-white/80 p-2 hover:bg-white transition-colors rounded-sm"
                    title="Poprzednie"
                  >
                    <ChevronLeft className="w-6 h-6 text-black" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="bg-white/80 p-2 hover:bg-white transition-colors rounded-sm"
                    title="Następne"
                  >
                    <ChevronRight className="w-6 h-6 text-black" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-sm text-sm">
                  {selectedImage + 1} / {listing.images.length}
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {listing.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-video overflow-hidden rounded-sm ${
                      selectedImage === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Opis */}
            <div className="bg-white p-6 shadow-md rounded-sm">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-black">
                Opis pojazdu
              </h2>
              <div className="leading-relaxed text-gray-700 whitespace-pre-line text-lg">
                {listing.description}
              </div>
            </div>

            {/* Komentarze */}
            <div className="bg-white p-6 shadow-md rounded-sm">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">
                Komentarze
              </h2>
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 border-l-4 rounded-sm"
                    style={{
                      borderColor: 'black',
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
                          className="w-full p-2 border rounded-sm focus:ring-2 focus:ring-black focus:outline-none"
                          rows={3}
                          onChange={(e) =>
                            handleSaveComment(comment.id, e.target.value)
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-600 text-base">{comment.text}</p>
                        {comment.image && (
                          <div className="mt-3">
                            <img
                              src={comment.image}
                              alt="Załączone zdjęcie"
                              className="max-h-48 rounded-sm cursor-pointer hover:opacity-95 transition-opacity"
                              onClick={() => openPhotoModal(0)}
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                      {comment.author === 'Użytkownik' && (
                        <button
                          onClick={() => handleEditComment(comment.id)}
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
                        <button
                          onClick={() => handleUpvote(comment.id)}
                          className="flex items-center gap-1"
                        >
                          <ThumbsUp className="w-5 h-5 text-green-600" />
                          <span>{comment.likes}</span>
                        </button>
                        <button
                          onClick={() => handleDownvote(comment.id)}
                          className="flex items-center gap-1"
                        >
                          <ThumbsDown className="w-5 h-5 text-red-600" />
                          <span>{comment.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Napisz komentarz..."
                  className="w-full p-4 border rounded-sm focus:ring-2 focus:ring-black focus:outline-none resize-none text-lg"
                  rows={3}
                />

                {/* Dodawanie zdjęcia */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-sm cursor-pointer">
                    <ImageIcon className="w-5 h-5" />
                    <span>Dodaj zdjęcie</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {commentImagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={commentImagePreview}
                        alt="Podgląd"
                        className="h-20 w-auto rounded-sm"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddComment}
                  className="bg-black text-white px-6 py-2 rounded-sm hover:bg-gray-800 transition-colors text-lg"
                >
                  Dodaj komentarz
                </button>
              </div>
            </div>

            {/* Podobne ogłoszenia */}
            <div className="bg-white p-6 shadow-md rounded-sm">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">
                Podobne ogłoszenia
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-sm cursor-pointer"
                    onClick={() => navigate(`/listing/${item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-t-sm"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="font-bold text-black text-lg">{item.price}</p>
                      <p className="text-sm text-gray-500">
                        {item.year} • {item.mileage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prawa kolumna */}
          <div className="w-full lg:w-[40%] space-y-4">
            {/* Tytuł i cena */}
            <div className="bg-white p-6 shadow-md rounded-sm">
              <h1 className="text-2xl font-bold text-black mb-4">
                {listing.title}
              </h1>
              <div className="text-4xl font-black text-green-600">
                {listing.price}
              </div>
            </div>

            {/* Dane techniczne */}
            <div className="bg-white p-6 shadow-md rounded-sm">
              <h2 className="text-lg font-bold mb-4 text-black">
                Dane techniczne
              </h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(listing.details).map(([key, value]) => (
                  <div key={key} className="p-2 bg-gray-50 rounded-sm">
                    <div className="text-gray-600 font-medium">{key}</div>
                    <div className="font-semibold text-black">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lokalizacja i kontakt */}
            <div className="bg-white p-6 shadow-md rounded-sm">
              <h2 className="text-lg font-bold mb-4 text-black">
                Lokalizacja i kontakt
              </h2>
              <div className="rounded-sm overflow-hidden mb-6">
                <iframe
                  title="Mapa lokalizacji"
                  width="100%"
                  height="200"
                  loading="lazy"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    listing.location.city
                  )}&output=embed`}
                />
              </div>

              <div className="space-y-3">
                <div className="text-gray-700 text-lg flex items-center justify-center gap-2">
                  <MapPin className="w-6 h-6" />
                  <span>
                    {listing.location.city}, {listing.location.region}
                  </span>
                </div>
                <button
                  onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                  className="w-full flex items-center justify-center gap-2 bg-[#35530A] text-white py-3 px-4 hover:bg-[#2A4208] transition-colors text-lg rounded-sm"
                >
                  <Phone className="w-6 h-6" />
                  {showPhoneNumber ? listing.contact.phone : 'Pokaż numer'}
                </button>
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 hover:bg-gray-200 transition-colors text-lg rounded-sm"
                >
                  <Mail className="w-6 h-6" />
                  Napisz wiadomość
                </button>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-center gap-6 mb-4">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Udostępnij na Facebooku"
                    >
                      <Facebook className="w-7 h-7 text-black" />
                    </button>
                    <button
                      onClick={() => handleShare('messenger')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Wyślij przez Messenger"
                    >
                      <MessageCircle className="w-7 h-7 text-black" />
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Wyślij mailem"
                    >
                      <Mail className="w-7 h-7 text-black" />
                    </button>
                  </div>
                  <button
                    onClick={handleToggleFavorite}
                    className="w-full flex items-center justify-center gap-2 text-gray-700 py-3 px-4 hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm text-lg rounded-sm"
                  >
                    <Heart
                      className={`w-6 h-6 ${isFavorite ? 'text-red-500' : 'text-black'}`}
                    />
                    {isFavorite ? 'W ulubionych' : 'Dodaj do ulubionych'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
      />
    </div>
  );
};

export default ListingDetails;           