import React, { useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
/**
 * Komponent do przesyłania plików z drag & drop
 */
const FileUploader = ({ 
  onFileSelect, 
  maxFiles = 20, 
  maxSize = 5, // w MB
  accept = "image/*",
  multiple = true,
  currentCount = 0,
  className = ''
}) => {
  const fileInputRef = useRef(null);
  
  // Obsługa kliknięcia przycisku
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // Obsługa zmiany plików
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    validateAndProcessFiles(files);
  };
  
  // Obsługa przeciągnięcia i upuszczenia
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    validateAndProcessFiles(files);
  };
  
  // Walidacja i przetwarzanie plików
  const validateAndProcessFiles = (files) => {
    // Sprawdzenie liczby plików
    if (currentCount + files.length > maxFiles) {
      alert(`Możesz dodać maksymalnie ${maxFiles} plików. Obecnie wybrano ${currentCount + files.length}.`);
      return;
    }
    
    // Sprawdzenie rozmiaru plików
    const validFiles = files.filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSize) {
        alert(`Plik "${file.name}" jest za duży (${sizeInMB.toFixed(2)} MB). Maksymalny rozmiar to ${maxSize} MB.`);
        return false;
      }
      return true;
    });
    
    // Przekazanie plików do rodzica
    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  };
  
  return (
    <div 
      className={`border-2 border-dashed border-gray-300 rounded-[2px] p-8 text-center ${className}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center cursor-pointer" onClick={handleButtonClick}>
        <FaCloudUploadAlt className="text-5xl text-gray-400 mb-4" />
        <span className="text-gray-600 text-lg mb-2">
          Przeciągnij pliki lub kliknij aby dodać
        </span>
        <span className="px-6 py-3 bg-[#35530A] text-white rounded-[2px] hover:bg-[#2c4a09] transition-colors">
          Wybierz pliki
        </span>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Maksymalny rozmiar: {maxSize}MB
        {multiple ? `, maksymalna liczba plików: ${maxFiles}` : ''}
      </div>
    </div>
  );
};

export default FileUploader;