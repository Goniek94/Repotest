import { createClient } from '@supabase/supabase-js'

// Używamy hardcoded wartości, jeśli zmienne środowiskowe nie są dostępne
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zcxakmniknrtvtnyetxd.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjeGFrbW5pa25ydHZ0bnlldHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzEzNzgsImV4cCI6MjA2NzA0NzM3OH0.b7YK5XZMHsS4s3RHGw3rvcmdlV_kjHbxXVF9jB8UO4w'

// Sprawdzamy, czy wartości są dostępne
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Brak kluczy Supabase! Sprawdź plik .env')
}

// Tworzymy klienta Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Sprawdzamy, czy klient został poprawnie utworzony
if (!supabase) {
  console.error('Nie udało się utworzyć klienta Supabase!')
}
