// ListingModeration.js
const ListingModeration = () => {
    const [pendingListings, setPendingListings] = useState([]);
    
    const handleModeration = async (listingId, action) => {
      switch(action) {
        case 'approve':
          await api.post(`/admin/listings/${listingId}/approve`);
          // Powiadomienie użytkownika
          sendNotification(listingId, 'LISTING_APPROVED');
          break;
        
        case 'reject':
          await api.post(`/admin/listings/${listingId}/reject`, {
            reason: rejectionReason
          });
          sendNotification(listingId, 'LISTING_REJECTED');
          break;
          
        case 'flag':
          await api.post(`/admin/listings/${listingId}/flag`, {
            flag: flagType
          });
          break;
      }
    };
  
    return (
      <div>
        <h2>Moderacja Ogłoszeń</h2>
        {pendingListings.map(listing => (
          <div key={listing.id}>
            <h3>{listing.title}</h3>
            <div className="actions">
              <button onClick={() => handleModeration(listing.id, 'approve')}>
                Zatwierdź
              </button>
              <button onClick={() => handleModeration(listing.id, 'reject')}>
                Odrzuć
              </button>
              <button onClick={() => handleModeration(listing.id, 'flag')}>
                Oflaguj
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };