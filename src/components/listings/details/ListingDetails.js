// src/components/listings/details/ListingDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ImageGallery from "./ImageGallery";
import TechnicalDetails from "./TechnicalDetails";
import Description from "./Description";
import ContactInfo from "./ContactInfo";
import CommentSection from "./CommentSection";
import SimilarListings from "./SimilarListings";
import ListingHeader from "./ListingHeader";
import CollapsibleSection from "./CollapsibleSection";
import AuthService from "../../../services/api/authApi";
import ViewHistoryService from "../../../services/viewHistoryService";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [similarListings, setSimilarListings] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const currentUser = AuthService.getCurrentUser();
  const userId = currentUser && (currentUser._id || currentUser.id);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        // Pobierz ogłoszenie
        const response = await fetch(`http://localhost:5000/api/ads/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Nie znaleziono ogłoszenia");
        const data = await response.json();
        setListing(data);
        
        // Dodaj oglądane ogłoszenie do historii przeglądania
        ViewHistoryService.addToViewHistory(data);

        // Pobierz komentarze
        const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setComments(
            data.map((c, idx) => ({
              id: c._id || idx + 1,
              author: c.user?.name
                ? `${c.user.name}${c.user.lastName ? " " + c.user.lastName : ""}`
                : "Użytkownik",
              userId: c.user?._id || c.user?.id,
              text: c.content,
              image: c.image,
              date: c.createdAt
                ? new Date(c.createdAt).toISOString().split("T")[0]
                : "",
              isEditing: false,
            }))
          );
        }
        // Pobierz podobne ogłoszenia (przykład)
        const searchParams = new URLSearchParams({
          brand: data.brand || data.make,
          model: data.model || "",
        });
        const similarResponse = await fetch(
          `http://localhost:5000/api/ads/search?${searchParams}`
        );
        const similarData = await similarResponse.json();
        setSimilarListings(
          (similarData.ads || []).slice(0, 4).map((ad) => ({
            id: ad._id,
            title: `${ad.brand || ad.make || ""} ${ad.model || ""}`.trim() || "Ogłoszenie",
            price: `${ad.price?.toLocaleString() || 0} zł`,
            year: ad.year?.toString() || "Nieznany",
            mileage: `${ad.mileage?.toLocaleString() || 0} km`,
            image:
              ad.images && ad.images.length > 0
                ? ad.images[0].startsWith("http")
                  ? ad.images[0]
                  : `http://localhost:5000${ad.images[0]}`
                : "/images/auto-788747_1280.jpg",
          }))
        );
      } catch (err) {
        setError(err.message || "Błąd ładowania ogłoszenia");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  // Dodawanie komentarza
  const handleAddComment = async (text, imageFile) => {
    setCommentError(null);
    if (!id) return;
    const formData = new FormData();
    formData.append("content", text);
    if (imageFile) formData.append("image", imageFile);

    try {
      const resp = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!resp.ok) {
        const errData = await resp.json();
        setCommentError(errData.message || "Błąd dodawania komentarza");
        return;
      }
      // Odśwież komentarze
      const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          data.map((c, idx) => ({
            id: c._id || idx + 1,
            author: c.user?.name
              ? `${c.user.name}${c.user.lastName ? " " + c.user.lastName : ""}`
              : "Użytkownik",
            userId: c.user?._id || c.user?.id,
            text: c.content,
            image: c.image,
            date: c.createdAt
              ? new Date(c.createdAt).toISOString().split("T")[0]
              : "",
            isEditing: false,
          }))
        );
      }
    } catch (err) {
      setCommentError("Błąd sieci podczas dodawania komentarza");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FCFCFC] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#35530A]"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-[#FCFCFC] min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-sm">
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#35530A] hover:text-[#44671A] font-medium"
          >
            ← Wróć do ogłoszeń
          </button>
        </div>
      </div>
    );
  }
  if (!listing) return null;

  // Get data needed for mobile header
  const brand = listing.make || listing.brand || '';
  const model = listing.model || '';
  const vehicleTitle = `${brand} ${model}`.trim();
  const price = listing.price ? `${listing.price.toLocaleString()} zł` : "Cena na żądanie";

  return (
    <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[8%] min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-[#35530A] hover:text-[#44671A] transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Powrót
      </button>
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout - unchanged */}
        <div className="hidden lg:flex flex-row gap-8">
          {/* Lewa kolumna: galeria, nagłówek, opis, komentarze */}
          <div className="w-full lg:w-[60%] space-y-8">
            <ListingHeader listing={listing} />
            <ImageGallery 
              images={listing.images && listing.images.length > 0 
                ? listing.images.map(img => 
                    img.startsWith('http') 
                      ? img 
                      : `http://localhost:5000${img.startsWith('/') ? '' : '/'}${img}`
                  )
                : []
              } 
            />
            
            {/* Nagłówek ogłoszenia - jeśli istnieje */}
            {listing.headline && (
              <div className="bg-white p-6 shadow-md rounded-sm">
                <h2 className="text-xl font-bold mb-4 text-black">
                  Nagłówek ogłoszenia
                </h2>
                <div className="bg-gray-50 p-4 rounded-md border-l-4 border-[#35530A]">
                  <p className="text-lg font-medium text-gray-800">
                    {listing.headline}
                  </p>
                </div>
              </div>
            )}
            
            <Description description={listing.description} />
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              userId={userId}
              commentError={commentError}
            />
          </div>
          {/* Prawa kolumna: dane techniczne, kontakt */}
          <div className="w-full lg:w-[40%] space-y-8">
            <TechnicalDetails listing={listing} />
            <ContactInfo listing={listing} />
          </div>
        </div>

        {/* Mobile Layout - with collapsible sections */}
        <div className="lg:hidden space-y-4">
          {/* 1. Zdjęcia */}
          <ImageGallery 
            images={listing.images && listing.images.length > 0 
              ? listing.images.map(img => 
                  img.startsWith('http') 
                    ? img 
                    : `http://localhost:5000${img.startsWith('/') ? '' : '/'}${img}`
                )
              : []
            } 
          />

          {/* 2. Marka, model i cena */}
          <div className="bg-white p-6 shadow-md rounded-sm">
            <div className="text-center">
              {vehicleTitle && (
                <h1 className="text-2xl font-bold text-black mb-4">
                  {vehicleTitle}
                </h1>
              )}
              <div className="text-2xl font-bold text-[#35530A]">
                {price}
              </div>
            </div>
          </div>

          {/* 3. Nagłówek ogłoszenia - taki jak na desktop */}
          <ListingHeader listing={listing} />

          {/* 3. Nagłówek - jeśli istnieje, taki jak na desktop */}
          {listing.headline && (
            <div className="bg-white p-6 shadow-md rounded-sm">
              <h2 className="text-xl font-bold mb-4 text-black">
                Nagłówek ogłoszenia
              </h2>
              <div className="bg-gray-50 p-4 rounded-md border-l-4 border-[#35530A]">
                <p className="text-lg font-medium text-gray-800">
                  {listing.headline}
                </p>
              </div>
            </div>
          )}

          {/* 4. Dane techniczne - zwijane sekcje (tylko te z prawej kolumny) */}
          <TechnicalDetails listing={listing} />

          {/* 5. Opis - taki jak na desktop */}
          <Description description={listing.description} />

          {/* 6. Komentarze - takie jak na desktop */}
          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            userId={userId}
            commentError={commentError}
          />

          {/* 7. Lokalizacja i kontakt - taka jak na desktop */}
          <ContactInfo listing={listing} />
        </div>

        {/* 8. Podobne ogłoszenia - zawsze na dole */}
        <div className="mt-10">
          <SimilarListings listings={similarListings} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
