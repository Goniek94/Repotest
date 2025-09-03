import React from 'react';
import { FileText, Edit, Trash } from 'lucide-react';

const DraftsList = ({ 
  localDrafts, 
  onContinueDraft, 
  onDeleteDraft 
}) => {
  if (localDrafts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#35530A]" />
        Wersje robocze ({localDrafts.length})
      </h3>
      <div className="space-y-4">
        {localDrafts.map((draft, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-sm shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {draft.draftName || `${draft.brand || 'Nieznana marka'} ${draft.model || 'Nieznany model'}`}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Marka:</span> {draft.brand || 'Nie podano'}
                  </div>
                  <div>
                    <span className="font-medium">Model:</span> {draft.model || 'Nie podano'}
                  </div>
                  <div>
                    <span className="font-medium">Rok:</span> {draft.productionYear || 'Nie podano'}
                  </div>
                  <div>
                    <span className="font-medium">Cena:</span> {draft.price ? `${draft.price} PLN` : 'Nie podano'}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Zapisano: {draft.savedAt ? new Date(draft.savedAt).toLocaleString('pl-PL') : 'Nieznana data'}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onContinueDraft(index)}
                  className="bg-[#35530A] text-white px-4 py-2 rounded-sm text-sm hover:bg-[#2D4A06] transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Kontynuuj
                </button>
                <button
                  onClick={() => onDeleteDraft(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-sm text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash className="w-4 h-4" />
                  Usuń
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftsList;
