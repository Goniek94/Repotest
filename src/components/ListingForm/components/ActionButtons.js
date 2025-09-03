import React from 'react';

const ActionButtons = ({ 
  onBackToEdit, 
  onPublish, 
  isSubmitting, 
  paymentCompleted 
}) => {
  return (
    <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
      <button
        onClick={onBackToEdit}
        className="
          bg-gray-100 text-gray-700
          px-6 py-3
          rounded-md
          hover:bg-gray-200
          transition-all
          duration-200
          flex items-center gap-2
        "
        disabled={isSubmitting || paymentCompleted}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Wróć do edycji
      </button>

      <button
        onClick={onPublish}
        disabled={isSubmitting || paymentCompleted}
        className="
          bg-[#35530A] text-white
          px-6 py-3
          rounded-md
          hover:bg-[#2D4A06]
          transition-all
          duration-200
          disabled:opacity-70
          disabled:cursor-not-allowed
          flex items-center gap-2
        "
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Przetwarzanie...
          </>
        ) : paymentCompleted ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Opublikowano!
          </>
        ) : (
          <>
            Przejdź do płatności
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
