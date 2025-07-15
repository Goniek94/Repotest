import { createClient } from '@supabase/supabase-js';

// Inicjalizacja Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zcxakmniknrtvtnyetxd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjeGFrbW5pa25ydHZ0bnlldHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzEzNzgsImV4cCI6MjA2NzA0NzM3OH0.b7YK5XZMHsS4s3RHGw3rvcmdlV_kjHbxXVF9jB8UO4w';

const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadCarImages = async (files, carId, mainImageFile, onProgress) => {
  // Sprawdzamy, czy mamy pliki do przesłania
  if (!files || files.length === 0) {
    return [];
  }

  console.log('🚀 Rozpoczynam upload do Supabase:', files.length, 'plików');

  // Ensure mainImageFile is always uploaded first if it exists
  const sortedFiles = [...files].sort((a, b) => {
    if (a === mainImageFile) return -1;
    if (b === mainImageFile) return 1;
    return 0;
  });

  try {
    const uploadedImages = [];
    const totalFiles = sortedFiles.length;

    for (let i = 0; i < sortedFiles.length; i++) {
      const file = sortedFiles[i];
      
      // Generuj unikalną nazwę pliku
      const timestamp = Date.now();
      const randomId = Math.floor(Math.random() * 1000000);
      const fileExtension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomId}.${fileExtension}`;
      
      console.log(`📤 Upload ${i + 1}/${totalFiles}: ${filename}`);

      // Upload do Supabase Storage
      const { data, error } = await supabase.storage
        .from('autosell')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Błąd uploadu do Supabase:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('✅ Upload sukces:', data);

      // Generuj pełny URL do pliku
      const publicUrl = `https://zcxakmniknrtvtnyetxd.supabase.co/storage/v1/object/public/autosell/${filename}`;
      
      uploadedImages.push({
        url: publicUrl,
        isMain: file === mainImageFile,
        originalName: file.name,
        filename: filename
      });

      // Aktualizuj progress
      if (onProgress) {
        const progress = Math.round(((i + 1) / totalFiles) * 100);
        onProgress(progress);
      }
    }

    console.log('🎉 Wszystkie pliki przesłane do Supabase:', uploadedImages);
    return uploadedImages;

  } catch (error) {
    console.error('💥 Błąd podczas przesyłania zdjęć do Supabase:', error);
    throw error;
  }
};

// Funkcja do usuwania zdjęć z Supabase
export const deleteCarImages = async (imageUrls) => {
  try {
    console.log('🗑️ Usuwanie zdjęć z Supabase:', imageUrls);

    const filenames = imageUrls.map(url => {
      // Wyciągnij nazwę pliku z URL
      const parts = url.split('/');
      return parts[parts.length - 1];
    });

    const { data, error } = await supabase.storage
      .from('autosell')
      .remove(filenames);

    if (error) {
      console.error('❌ Błąd usuwania z Supabase:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    console.log('✅ Pliki usunięte z Supabase:', data);
    return { success: true, data };

  } catch (error) {
    console.error('💥 Błąd podczas usuwania zdjęć z Supabase:', error);
    throw error;
  }
};
