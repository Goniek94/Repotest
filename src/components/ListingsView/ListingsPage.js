return (
  <div className="min-h-screen bg-gray-100">
    <div className="wrapper py-8 sm:py-10 md:py-12 lg:py-16 space-y-6">
      <div className="section">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white px-6 py-2.5 rounded shadow-md hover:shadow-lg transition-all duration-300 bg-[#35530A] hover:bg-[#44671A]"
          >
            {searchOpen ? 'Ukryj wyszukiwarkę' : 'Pokaż wyszukiwarkę'}
          </button>
        </div>

        {searchOpen && (
          <SearchForm
            initialValues={filters}
            onFilterChange={handleFilterChange}
          />
        )}

        <ListingControls
          sortType={sortType}
          setSortType={setSortType}
          offerType={offerType}
          setOfferType={setOfferType}
          onlyFeatured={onlyFeatured}
          setOnlyFeatured={setOnlyFeatured}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      <div className="section">
        {loading && currentPage === 1 ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#35530A]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        ) : (
          <>
            {listings.length === 0 ? (
              <div className="bg-white shadow-md rounded-md p-8 text-center mt-4">
                <h3 className="text-xl font-semibold">Nie znaleziono ogłoszeń</h3>
                <p className="mt-2 text-gray-600">
                  Spróbuj zmienić kryteria wyszukiwania.
                </p>
              </div>
            ) : (
              <div
                className={
                  finalViewMode === 'grid'
                    ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6'
                    : 'space-y-4 mt-6'
                }
              >
                {listings.map((listing) =>
                  finalViewMode === 'grid' ? (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onNavigate={() => navigateToListing(listing.id)}
                      onFavorite={() => toggleFavorite(listing.id)}
                      isFavorite={favorites.includes(String(listing.id))}
                      message={favMessages[listing.id]}
                    />
                  ) : (
                    <ListingListItem
                      key={listing.id}
                      listing={listing}
                      onNavigate={() => navigateToListing(listing.id)}
                      onFavorite={() => toggleFavorite(listing.id)}
                      isFavorite={favorites.includes(String(listing.id))}
                      message={favMessages[listing.id]}
                    />
                  )
                )}
              </div>
            )}

            {currentPage < totalPages && (
              <div className="text-center mt-8">
                {loading ? (
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
                ) : (
                  <button
                    onClick={handleShowMore}
                    className="px-8 py-3 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-[#35530A] hover:bg-[#44671A]"
                  >
                    Pokaż więcej
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);
