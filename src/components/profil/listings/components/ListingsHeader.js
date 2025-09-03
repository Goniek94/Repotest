import React from 'react';
import { FileText } from 'lucide-react';

const ListingsHeader = () => {
  return (
    <div className="bg-[#35530A] rounded-t-2xl shadow-lg p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Moje ogłoszenia
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ListingsHeader;
