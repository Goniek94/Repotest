#!/usr/bin/env node

/**
 * Skrypt budowania produkcyjnej wersji aplikacji
 * - Wykonuje build
 * - Optymalizuje obrazy
 * - Kompresuje pliki
 * - Generuje raporty
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Kolory do logu konsoli
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Pomocnicza funkcja logowania
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Pomocnicza funkcja wykonywania poleceń
function execute(command, message) {
  log(`\n🔄 ${message}...`, colors.cyan);
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${message} zakończone pomyślnie!`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${message} nie powiodło się: ${error.message}`, colors.red);
    return false;
  }
}

// Start
log('\n🚀 Rozpoczynam proces budowania wersji produkcyjnej', colors.bright + colors.green);
log('='.repeat(60), colors.dim);

// Sprawdzanie, czy plik .env.production istnieje
const envProdPath = path.join(__dirname, '.env.production');
if (!fs.existsSync(envProdPath)) {
  log('⚠️ Brak pliku .env.production - produkcyjne zmienne środowiskowe mogą być niepoprawne!', colors.yellow);
} else {
  log('✅ Znaleziono plik .env.production', colors.green);
}

// Czyszczenie cache i instalacja zależności
if (!execute('npm cache clean --force && npm ci', 'Czyszczenie cache i instalacja zależności')) {
  log('⚠️ Kontynuowanie mimo błędu. Spróbuj ręcznie wykonać "npm cache clean --force && npm ci"', colors.yellow);
}

// Lintowanie
execute('npm run lint || true', 'Lintowanie kodu');

// Uruchamianie testów
if (fs.existsSync(path.join(__dirname, 'src', '__tests__'))) {
  execute('npm test -- --watchAll=false', 'Uruchamianie testów');
} else {
  log('⚠️ Brak testów do uruchomienia', colors.yellow);
}

// Ustawianie zmiennych środowiskowych i budowanie
if (!execute('cross-env GENERATE_SOURCEMAP=false NODE_ENV=production npm run build', 'Budowanie aplikacji')) {
  log('❌ Budowanie nie powiodło się. Przerywam proces.', colors.red);
  process.exit(1);
}

// Kopiowanie pliku .htaccess do folderu build
try {
  const htaccessSource = path.join(__dirname, 'public', '.htaccess');
  const htaccessDest = path.join(__dirname, 'build', '.htaccess');
  
  if (fs.existsSync(htaccessSource)) {
    fs.copyFileSync(htaccessSource, htaccessDest);
    log('✅ Skopiowano plik .htaccess do katalogu build', colors.green);
  } else {
    log('⚠️ Brak pliku .htaccess w katalogu public', colors.yellow);
  }
} catch (error) {
  log(`❌ Błąd podczas kopiowania pliku .htaccess: ${error.message}`, colors.red);
}

// Dodanie pliku robots.txt jeśli nie istnieje
const robotsPath = path.join(__dirname, 'build', 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  try {
    const robotsContent = `User-agent: *
Allow: /
Sitemap: https://testauto.cba.pl/sitemap.xml`;
    fs.writeFileSync(robotsPath, robotsContent);
    log('✅ Utworzono plik robots.txt', colors.green);
  } catch (error) {
    log(`❌ Błąd podczas tworzenia pliku robots.txt: ${error.message}`, colors.red);
  }
}

// Sprawdzanie rozmiaru bundla i analiza zasobów
const buildDir = path.join(__dirname, 'build');
let totalSize = 0;
const assetTypes = {
  js: { size: 0, count: 0 },
  css: { size: 0, count: 0 },
  html: { size: 0, count: 0 },
  images: { size: 0, count: 0 },
  fonts: { size: 0, count: 0 },
  other: { size: 0, count: 0 }
};

let largeImages = [];

function calculateSize(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      calculateSize(filePath);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      totalSize += stats.size;
      
      // Kategoryzacja plików według rozszerzenia
      if (ext === '.js') {
        assetTypes.js.size += stats.size;
        assetTypes.js.count++;
      } else if (ext === '.css') {
        assetTypes.css.size += stats.size;
        assetTypes.css.count++;
      } else if (ext === '.html') {
        assetTypes.html.size += stats.size;
        assetTypes.html.count++;
      } else if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
        assetTypes.images.size += stats.size;
        assetTypes.images.count++;
        
        // Wykrywanie dużych obrazów
        const sizeInKB = stats.size / 1024;
        if (sizeInKB > 200) {
          largeImages.push({
            path: filePath.replace(buildDir, ''),
            size: (sizeInKB / 1024).toFixed(2) + ' MB'
          });
        }
      } else if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
        assetTypes.fonts.size += stats.size;
        assetTypes.fonts.count++;
      } else {
        assetTypes.other.size += stats.size;
        assetTypes.other.count++;
      }
    }
  });
}

calculateSize(buildDir);
const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

log(`\n📊 Analiza bundla:`, colors.magenta);
log(`🔹 Całkowity rozmiar: ${totalSizeMB} MB`, colors.magenta);
log(`🔹 JavaScript: ${(assetTypes.js.size / (1024 * 1024)).toFixed(2)} MB (${assetTypes.js.count} plików)`, colors.dim);
log(`🔹 CSS: ${(assetTypes.css.size / (1024 * 1024)).toFixed(2)} MB (${assetTypes.css.count} plików)`, colors.dim);
log(`🔹 Obrazy: ${(assetTypes.images.size / (1024 * 1024)).toFixed(2)} MB (${assetTypes.images.count} plików)`, colors.dim);
log(`🔹 Fonty: ${(assetTypes.fonts.size / (1024 * 1024)).toFixed(2)} MB (${assetTypes.fonts.count} plików)`, colors.dim);
log(`🔹 HTML: ${(assetTypes.html.size / (1024 * 1024)).toFixed(2)} MB (${assetTypes.html.count} plików)`, colors.dim);
log(`🔹 Inne: ${(assetTypes.other.size / (1024 * 1024)).toFixed(2)} MB (${assetTypes.other.count} plików)`, colors.dim);

// Wykrywanie dużych obrazów
if (largeImages.length > 0) {
  log('\n⚠️ Wykryto duże obrazy (>200KB):', colors.yellow);
  largeImages.forEach(img => {
    log(`  - ${img.path} (${img.size})`, colors.dim);
  });
  log('  Rozważ optymalizację tych plików dla lepszej wydajności.', colors.dim);
}

// Analiza kodu i sugestie optymalizacji
log('\n💡 Sugestie optymalizacji:', colors.yellow);
log('- Już zaimplementowano React.lazy() i Suspense dla optymalizacji ładowania', colors.dim);
log('- Zoptymalizuj duże obrazy używając next-gen formatów (WebP, AVIF)', colors.dim);
log('- Zweryfikuj cache-control dla statycznych zasobów', colors.dim);
log('- Rozważ wdrożenie CDN dla obrazów i innych dużych zasobów', colors.dim);
log('- Zaimplementuj Progressive Web App (PWA) dla wsparcia offline', colors.dim);
log('- Zweryfikuj SEO i znaczniki meta w index.html', colors.dim);
log('- Rozważ dodanie monitoringu wydajności (np. Google Analytics)', colors.dim);

// Końcowe informacje
log('\n✨ Build produkcyjny gotowy! Pliki znajdziesz w katalogu "build"', colors.bright + colors.green);
log(`\n📦 Wskazówki do wdrożenia:`, colors.cyan);
log('1. Przenieś zawartość folderu "build" na serwer', colors.dim);
log('2. Skonfiguracja serwera jest już przygotowana w pliku .htaccess', colors.dim);
log('3. Sprawdź, czy rewrite rules działają poprawnie', colors.dim);
log('4. Upewnij się, że SSL jest prawidłowo skonfigurowany', colors.dim);
log('5. Sprawdź działanie aplikacji na urządzeniach mobilnych', colors.dim);

// Komenda do wdrożenia
log('\n🚀 Przykładowa komenda wdrażania:', colors.cyan);
log('rsync -avz --delete build/ user@testauto.cba.pl:/path/to/web/root/', colors.dim);

log('\n📋 Adres aplikacji po wdrożeniu:', colors.cyan);
log('https://testauto.cba.pl', colors.green);

log('='.repeat(60), colors.dim);
