import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  MessageCircle,
  Flag,
  Edit2,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Stan do wyświetlania numeru, modala wiadomości, komentarzy:
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Zmieniamy tablicę komentarzy – dodajemy pole likes i dislikes.
  // isEditing – tylko jeśli author === 'Użytkownik'.
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Jan Kowalski',
      text: 'Świetny samochód, miałem okazję oglądać na żywo. Polecam!',
      date: '2024-03-01',
      isEditing: false,
      likes: 0,
      dislikes: 0
    },
    {
      id: 2,
      author: 'Anna Nowak',
      text: 'Czy możliwe jest negocjowanie ceny?',
      date: '2024-03-02',
      isEditing: false,
      likes: 0,
      dislikes: 0
    },
    {
      id: 3,
      author: 'Użytkownik',
      text: 'Świetnie się prowadzi – polecam!',
      date: '2024-03-05',
      isEditing: false,
      likes: 0,
      dislikes: 0
    }
  ]);

  // Stan do obsługi dodania do ulubionych (czerwone serduszko):
  const [isFavorite, setIsFavorite] = useState(false);

  // Obsługa kliknięcia serduszka (ulubionych):
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Dane przykładowego ogłoszenia
  const listing = {
    id,
    title: 'Volkswagen Golf 1.4 TSI',
    price: '45 000 zł',
    images: [
      '/images/automobile-1834278_640.jpg',
      '/images/dodge-challenger-8214392_640.jpg',
      '/images/car-1880381_640.jpg',
      '/images/dodge-challenger-8214392_640.jpg',
      '/images/automobile-1834278_640.jpg',
      '/images/car-1880381_640.jpg',
      '/images/automobile-1834278_640.jpg',
      '/images/car-1880381_640.jpg',
      '/images/dodge-challenger-8214392_640.jpg',
      '/images/automobile-1834278_640.jpg',
      '/images/dodge-challenger-8214392_640.jpg',
      '/images/car-1880381_640.jpg',
      '/images/automobile-1834278_640.jpg',
      '/images/car-1880381_640.jpg',
      '/images/dodge-challenger-8214392_640.jpg',
      '/images/automobile-1834278_640.jpg',
      '/images/car-1880381_640.jpg',
      '/images/dodge-challenger-8214392_640.jpg',
      '/images/automobile-1834278_640.jpg',
      '/images/car-1880381_640.jpg'
    ],
    details: {
      Marka: 'Volkswagen',
      Model: 'Golf',
      Generacja: '7',
      'Wersja modelu': '1.4 TSI',
      Rok: '2021',
      Przebieg: '45 000 km',
      Paliwo: 'Benzyna',
      'Pojemność silnika': '1395 cm³',
      Moc: '122 KM',
      'Skrzynia biegów': 'Automatyczna',
      Napęd: 'Na przednie koła',
      'Typ nadwozia': 'Kompakt',
      Kolor: 'Srebrny metalik',
      'Liczba drzwi': '5',
      'Liczba miejsc': '5',
      'Stan techniczny': 'Bezwypadkowy',
      'Kraj pochodzenia': 'Niemcy',
      VIN: 'WVWZZZAUZ3W58**',
      'Pierwsza rejestracja': '01.2021'
    },
    location: {
      region: 'Mazowieckie',
      city: 'Warszawa'
    },
    contact: {
      phone: '+48 123 456 789',
      email: 'sprzedawca@autosell.pl'
    },
    description: `
Jest to zadbany egzemplarz Volkswagena Golfa 1.4 TSI.
Samochód jest w idealnym stanie technicznym i wizualnym.
Auto było serwisowane wyłącznie w autoryzowanym serwisie Volkswagena
(książka serwisowa do wglądu).

Silnik 1.4 TSI o mocy 122 KM pracuje bez zarzutu i cechuje się niskim spalaniem
(ok. 6,5 l/100 km w cyklu mieszanym). Skrzynia automatyczna działa płynnie.

Dodatkowe zalety:
- Klimatyzacja dwustrefowa (sprawna, niedawno odgrzybiona)
- Czujniki parkowania przód i tył
- Kamera cofania
- System start-stop
- Elektrycznie sterowane i podgrzewane fotele
- Nawigacja GPS
- Wielofunkcyjna kierownica
- Wspomaganie kierownicy
- Podgrzewane lusterka boczne

Wnętrze auta jest czyste i zadbane. Lakier w bardzo dobrym stanie, brak korozji.
Samochód bezwypadkowy. Gotowy do jazdy, możliwość sprawdzenia w dowolnym warsztacie
lub ASO.

Zapraszam do kontaktu i na jazdę próbną!
`
  };

  // Sekcja "Podobne ogłoszenia":
  const similarListings = [
    {
      id: 1,
      title: 'VW Golf 7 1.4 TSI',
      price: '50 000 zł',
      year: '2015',
      mileage: '150 000 km',
      image: '/images/automobile-1834278_640.jpg'
    },
    {
      id: 2,
      title: 'BMW 3 E36 1.8 is',
      price: '30 000 zł',
      year: '1993',
      mileage: '223 565 km',
      image: '/images/car-1880381_640.jpg'
    },
    {
      id: 3,
      title: 'Audi A3 2.0 TDI',
      price: '55 000 zł',
      year: '2018',
      mileage: '98 000 km',
      image: '/images/dodge-challenger-8214392_640.jpg'
    },
    {
      id: 4,
      title: 'Ford Focus 1.6 TDCi',
      price: '28 000 zł',
      year: '2014',
      mileage: '180 000 km',
      image: '/images/car-1880381_640.jpg'
    },
    {
      id: 5,
      title: 'Opel Astra J 1.6 Turbo',
      price: '37 900 zł',
      year: '2016',
      mileage: '110 000 km',
      image: '/images/dodge-challenger-8214392_640.jpg'
    }
  ];

  // Modal wysyłania wiadomości
  const MessageModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          style={{ borderRadius: '2px' }}
        />
        <div
          className="relative bg-white p-6 w-full max-w-md mx-4 text-center"
          style={{ borderRadius: '2px', backgroundColor: '#FFFFFF' }}
        >
          <h3 className="text-2xl font-bold mb-4 text-[#35530A]">Napisz wiadomość</h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Temat"
              className="w-full p-3 border focus:ring-2 focus:ring-green-500 focus:outline-none text-lg"
              style={{ borderRadius: '2px', borderColor: '#ccc' }}
            />
            <textarea
              placeholder="Treść wiadomości"
              rows={4}
              className="w-full p-3 border focus:ring-2 focus:ring-green-500 focus:outline-none resize-none text-lg"
              style={{ borderRadius: '2px', borderColor: '#ccc' }}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 text-white py-3 rounded-lg hover:bg-green-700 transition-colors text-lg"
                style={{ backgroundColor: '#35530A', borderRadius: '2px' }}
              >
                Wyślij
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors text-lg"
                style={{ borderRadius: '2px' }}
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Obsługa dodawania komentarzy
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'Użytkownik', // Zakładamy, że aktualny autor to 'Użytkownik'
        text: newComment,
        date: new Date().toISOString().split('T')[0],
        isEditing: false,
        likes: 0,
        dislikes: 0
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  // Funkcja do włączania/wyłączania trybu edycji tylko dla autora 'Użytkownik'
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

  // Zapisanie zmiany tekstu komentarza po edycji
  const handleSaveComment = (commentId, newText) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, text: newText, isEditing: false }
          : comment
      )
    );
  };

  // Kciuki w górę/w dół:
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

  // Mini-galeria zdjęć
  const [selectedImage, setSelectedImage] = useState(0);

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

  // Stan i logika do powiększenia zdjęcia (modal)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Otwieranie modala
  const openPhotoModal = (index) => {
    setPhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  // Zamknięcie modala
  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
  };

  // Przycisk "następne" w modalu
  const nextPhoto = () => {
    setPhotoIndex((prev) =>
      prev < listing.images.length - 1 ? prev + 1 : 0
    );
  };

  // Przycisk "poprzednie" w modalu
  const prevPhoto = () => {
    setPhotoIndex((prev) =>
      prev > 0 ? prev - 1 : listing.images.length - 1
    );
  };

  // Zamknięcie modala zdjęcia klawiszem Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPhotoModalOpen) {
        closePhotoModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPhotoModalOpen]);

  // Funkcja udostępniania (z tooltipami)
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
        window.open(`mailto:?subject=${listing.title}&body=${url}`);
        break;
      default:
        return;
    }
  };

  return (
    <div
      className="bg-[#FCFCFC] py-8 px-[10%]"
      style={{ maxWidth: '1600px', margin: '0 auto' }}
    >
      {/* Modal powiększonego zdjęcia */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Tło */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={closePhotoModal}
          />
          {/* Kontener */}
          <div className="relative text-center max-w-4xl w-full mx-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={closePhotoModal}
              title="Zamknij (Esc)"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={prevPhoto}
                className="bg-white/90 p-2 hover:bg-white transition-colors rounded-[2px]"
                title="Poprzednie zdjęcie"
              >
                <ChevronLeft className="w-8 h-8 text-[#35530A]" />
              </button>
              <img
                src={listing.images[photoIndex]}
                alt={`Zdjęcie powiększone ${photoIndex + 1}`}
                className="object-contain max-h-[80vh] mx-auto rounded-[2px]"
              />
              <button
                onClick={nextPhoto}
                className="bg-white/90 p-2 hover:bg-white transition-colors rounded-[2px]"
                title="Następne zdjęcie"
              >
                <ChevronRight className="w-8 h-8 text-[#35530A]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Button powrotu */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 font-bold text-xl"
        style={{ color: '#35530A', borderRadius: '2px' }}
      >
        ← Powrót do ogłoszeń
      </button>

      {/* Główna siatka */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center">
        {/* Lewa kolumna */}
        <div className="lg:col-span-2 space-y-8">
          {/* Galeria */}
          <div
            className="p-6 shadow-lg text-center"
            style={{ borderRadius: '2px', backgroundColor: '#FFFFFF' }}
          >
            <div
              className="relative aspect-video mb-6"
              style={{ borderRadius: '2px' }}
            >
              <img
                src={listing.images[selectedImage]}
                alt={`Główne zdjęcie ${selectedImage + 1}`}
                className="w-full h-full object-cover rounded-[2px] cursor-pointer"
                onClick={() => openPhotoModal(selectedImage)}
                title="Kliknij, aby powiększyć (Esc – zamknij)"
              />
              {/* Przyciski na zdjęciu (poprzednie / następne) */}
              <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="bg-white/80 p-2 hover:bg-white transition-colors rounded-[2px]"
                  title="Poprzednie"
                >
                  <ChevronLeft className="w-6 h-6" style={{ color: '#35530A' }} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="bg-white/80 p-2 hover:bg-white transition-colors rounded-[2px]"
                  title="Następne"
                >
                  <ChevronRight className="w-6 h-6" style={{ color: '#35530A' }} />
                </button>
              </div>
            </div>

            {/* Miniaturki */}
            <div className="grid grid-cols-5 gap-2">
              {listing.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-video overflow-hidden rounded-[2px] ${
                    selectedImage === index ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Opis pojazdu (zawiera nazwę samochodu) */}
          <div
            className="p-6 shadow-lg"
            style={{ borderRadius: '2px', backgroundColor: '#FFFFFF' }}
          >
            <h2
              className="font-bold text-3xl mb-4 text-[#35530A] text-center"
            >
              Opis pojazdu
            </h2>
            {/* NAZWA SAMOCHODU */}
            <h3
              className="text-xl font-semibold mb-4 text-[#35530A] text-center"
            >
              {listing.title}
            </h3>
            <div
              className="leading-relaxed text-gray-700 whitespace-pre-line text-lg"
              style={{ borderRadius: '2px' }}
            >
              {listing.description}
            </div>
          </div>

          {/* Komentarze */}
          <div
            className="p-6 shadow-lg"
            style={{ borderRadius: '2px', backgroundColor: '#FFFFFF' }}
          >
            <h2
              className="font-bold text-3xl mb-6 text-[#35530A] text-center"
            >
              Komentarze
            </h2>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border-l-4 text-left"
                  style={{
                    borderRadius: '2px',
                    borderColor: '#35530A',
                    backgroundColor: '#F9F9F9'
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>

                  {/* Tryb edycji tylko jeśli to komentarz Użytkownika */}
                  {comment.isEditing ? (
                    <div className="mt-2">
                      <textarea
                        defaultValue={comment.text}
                        className="w-full p-2 border focus:ring-2 focus:ring-green-500 focus:outline-none"
                        style={{ borderRadius: '2px', borderColor: '#ccc' }}
                        rows={3}
                        onChange={(e) =>
                          handleSaveComment(comment.id, e.target.value)
                        }
                      />
                      {/* Można dodać przycisk do anulowania, ale aby uprościć 
                          – jeśli ktoś zedytuje, to i tak się aktualizuje w onChange
                          lub można to zrobić od razu, np. po wyjściu z pola. */}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-base">
                      {comment.text}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    {/* Tylko jeśli komentarz 'Użytkownik', pokaż Edytuj */}
                    {comment.author === 'Użytkownik' && (
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                        title="Edytuj swój komentarz"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edytuj
                      </button>
                    )}

                    {/* Zgłoś */}
                    <button
                      className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                      title="Zgłoś komentarz"
                    >
                      <Flag className="w-4 h-4" />
                      Zgłoś
                    </button>

                    {/* Kciuki (lubie / nie lubię) */}
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => handleUpvote(comment.id)}
                        className="flex items-center gap-1 hover:text-green-700 transition-colors"
                        title="Lubię to"
                      >
                        <ThumbsUp className="w-5 h-5 text-green-600" />
                        <span>{comment.likes}</span>
                      </button>
                      <button
                        onClick={() => handleDownvote(comment.id)}
                        className="flex items-center gap-1 hover:text-red-700 transition-colors"
                        title="Nie lubię"
                      >
                        <ThumbsDown className="w-5 h-5 text-red-600" />
                        <span>{comment.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dodawanie komentarza */}
            <div className="mt-6 text-center">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Napisz komentarz..."
                className="w-full p-4 border focus:ring-2 focus:ring-green-500 focus:outline-none resize-none text-lg"
                rows={3}
                style={{ borderRadius: '2px', borderColor: '#ccc' }}
              />
              <button
                onClick={handleAddComment}
                className="mt-2 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-lg"
                style={{ backgroundColor: '#35530A', borderRadius: '2px' }}
              >
                Dodaj komentarz
              </button>
            </div>
          </div>
        </div>

        {/* Prawa kolumna (Cena, Dane, Kontakt, Mapa...) */}
        <div className="space-y-8">
          {/* CENA – nad danymi technicznymi */}
          <div
            className="p-6 shadow-lg text-center"
            style={{ borderRadius: '2px', backgroundColor: '#FFFFFF' }}
          >
            <h2 className="text-2xl font-bold mb-2 text-[#35530A]">
              Cena
            </h2>
            <div className="text-4xl font-extrabold text-[#35530A]">
              {listing.price}
            </div>
          </div>

          {/* Dane techniczne */}
          <div
            className="p-6 shadow-lg text-center"
            style={{ borderRadius: '2px', backgroundColor: '#FFFFFF' }}
          >
            <h2 className="text-3xl font-bold mb-6 text-[#35530A]">
              Dane techniczne
            </h2>
            <div className="space-y-2">
              {Object.entries(listing.details).map(([key, value]) => (
                <div
                  key={key}
                  className="py-2"
                  style={{
                    borderBottom: '1px solid #35530A'
                  }}
                >
                  <span className="text-gray-700 text-lg font-semibold">
                    {key}:
                  </span>{' '}
                  <span className="font-medium text-lg">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kontakt */}
          <div
            className="p-6 shadow-lg text-center"
            style={{ borderRadius: '2px', backgroundColor: '#FFFFFF' }}
          >
            <h2 className="text-3xl font-bold mb-6 text-[#35530A]">Kontakt</h2>

            <div className="text-gray-700 text-lg mb-4 flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6" />
              <span>
                {listing.location.city}, {listing.location.region}
              </span>
            </div>
            <button
              onClick={() => setShowPhoneNumber(!showPhoneNumber)}
              className="w-full flex items-center justify-center gap-2 text-white py-3 px-4 hover:bg-green-700 transition-colors text-lg"
              style={{ borderRadius: '2px', backgroundColor: '#35530A' }}
              title="Pokaż / Ukryj numer telefonu"
            >
              <Phone className="w-6 h-6" />
              {showPhoneNumber ? listing.contact.phone : 'Pokaż numer'}
            </button>
            <button
              onClick={() => setShowMessageModal(true)}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 hover:bg-gray-200 transition-colors text-lg"
              style={{ borderRadius: '2px' }}
              title="Napisz wiadomość"
            >
              <Mail className="w-6 h-6" />
              Napisz wiadomość
            </button>
          </div>

          {/* Udostępnianie + Serduszko */}
          <div
            className="p-6 shadow-lg text-center"
            style={{ borderRadius: '2px', backgroundColor: '#FFFFFF' }}
          >
            <div className="flex justify-center gap-6 mb-4">
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Udostępnij na Facebooku"
              >
                <Facebook className="w-7 h-7" style={{ color: '#35530A' }} />
              </button>
              <button
                onClick={() => handleShare('messenger')}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Udostępnij przez Messenger"
              >
                <MessageCircle className="w-7 h-7" style={{ color: '#35530A' }} />
              </button>
              <button
                onClick={() => handleShare('email')}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Wyślij mailem"
              >
                <Mail className="w-7 h-7" style={{ color: '#35530A' }} />
              </button>
            </div>
            <button
              onClick={handleToggleFavorite}
              className="w-full flex items-center justify-center gap-2 text-gray-700 py-3 px-4 hover:bg-gray-50 transition-colors border shadow-sm text-lg"
              style={{ borderRadius: '2px', borderColor: '#eaeaea' }}
              title="Dodaj do ulubionych"
            >
              <Heart
                className="w-6 h-6"
                style={{ color: isFavorite ? 'red' : '#35530A' }}
              />
              {isFavorite ? 'W ulubionych' : 'Dodaj do ulubionych'}
            </button>
          </div>

          {/* Mapa */}
          <div
            className="p-6 shadow-lg text-center"
            style={{ borderRadius: '2px', backgroundColor: '#FFFFFF' }}
          >
            <h2 className="text-3xl font-bold mb-4 text-[#35530A]">
              Lokalizacja na mapie
            </h2>
            <div style={{ borderRadius: '2px', overflow: 'hidden' }}>
              <iframe
                title="Mapa lokalizacji"
                width="100%"
                height="300"
                loading="lazy"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  listing.location.city
                )}&output=embed`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Podobne ogłoszenia (pod opisem i komentarzami), na całą szerokość */}
      <div
        className="mt-12 p-6 shadow-lg"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '2px'
        }}
      >
        <h2
          className="text-3xl font-bold mb-6 text-[#35530A] text-center"
        >
          Podobne ogłoszenia
        </h2>
        <div className="overflow-x-auto">
          <div className="flex flex-nowrap gap-4 justify-center">
            {similarListings.map((item) => (
              <div
                key={item.id}
                className="w-60 flex-shrink-0 shadow-md hover:shadow-lg transition-shadow"
                style={{
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  style={{ borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="font-bold mb-1 text-[#35530A]">{item.price}</p>
                  <p className="text-sm text-gray-500">
                    {item.year} • {item.mileage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal wiadomości */}
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
      />
    </div>
  );
};

export default ListingDetails;
