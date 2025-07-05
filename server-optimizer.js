#!/usr/bin/env node

/**
 * Narzędzie do optymalizacji i analizy wydajności aplikacji React (Marketplace Frontend)
 * 
 * Ten skrypt analizuje kod źródłowy aplikacji, konfigurację budowania 
 * i sugeruje optymalizacje wydajnościowe.
 * 
 * Użycie: node server-optimizer.js [opcje]
 * Opcje:
 *   --analyze  - Analizuje rozmiar bundle'a i zależności
 *   --optimize - Automatycznie wprowadza optymalizacje
 *   --clean    - Czyści niepotrzebne pliki (cache, stare buildy)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk') || { 
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

// Ścieżka do głównego katalogu projektu
const rootDir = path.resolve(__dirname);
const srcDir = path.join(rootDir, 'src');
const buildDir = path.join(rootDir, 'build');
const nodeModulesDir = path.join(rootDir, 'node_modules');

// Konfiguracja
const config = {
  // Pliki które zawsze powinny być ładowane leniwie (lazy loading)
  componentsToLazyLoad: [
    'AdminPanel',
    'ListingDetails',
    'UserProfileRoutes',
    'CreateListingForm',
    'AddListingView'
  ],
  // Ważne komponenty, które powinny być ładowane od razu
  criticalComponents: [
    'Navigation',
    'Footer',
    'App',
    'AuthContext',
    'NotificationContext'
  ],
  // Rozszerzenia plików do analizy
  fileExtensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
  // Maksymalny rozmiar pliku (w KB) przed ostrzeżeniem
  maxFileSize: 50,
  // Maksymalna złożoność cyklomatyczna
  maxComplexity: 15
};

/**
 * Funkcja do logowania komunikatów
 */
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  
  switch (type) {
    case 'success':
      console.log(chalk.green(`${prefix} ✅ ${message}`));
      break;
    case 'error':
      console.error(chalk.red(`${prefix} ❌ ${message}`));
      break;
    case 'warning':
      console.warn(chalk.yellow(`${prefix} ⚠️ ${message}`));
      break;
    case 'info':
      console.log(chalk.blue(`${prefix} ℹ️ ${message}`));
      break;
    case 'header':
      console.log('\n' + chalk.bold(chalk.magenta(`=== ${message} ===`)));
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

/**
 * Sprawdzenie zależności w package.json
 */
function analyzeDependencies() {
  log('Analizowanie zależności w package.json', 'header');
  
  try {
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Sprawdź, czy istnieją przestarzałe paczki
    const outdatedPackages = [];
    const securityRisks = [];
    const unnecessaryPackages = [];
    const recommendedAdditions = [];
    
    // Lista przestarzałych paczek, które należy zaktualizować
    const knownOutdated = [
      'react-scripts@<5.0.0', 
      'webpack@<5.0.0',
      'babel-loader@<8.0.0'
    ];
    
    // Lista zbędnych paczek, które mogą być usunięte
    const potentiallyUnnecessary = [
      'jquery',
      'moment', // Zalecamy dayjs jako lżejszą alternatywę
      'lodash', // Często można zastąpić nowoczesnymi metodami ES6+
    ];
    
    // Lista rekomendowanych paczek dla poprawy wydajności
    const recommendations = [
      'react-query',
      'swr',
      'dayjs',
      'immer',
      'workbox-webpack-plugin'
    ];
    
    // Sprawdź zależności pod kątem przestarzałych
    const allDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };
    
    Object.entries(allDeps).forEach(([name, version]) => {
      // Prosta heurystyka dla potencjalnie przestarzałych
      if (version.includes('^') && version.match(/\^[0-2]\./)) {
        outdatedPackages.push(`${name}@${version}`);
      }
      
      // Sprawdź, czy to potencjalnie niepotrzebna paczka
      if (potentiallyUnnecessary.includes(name)) {
        unnecessaryPackages.push(name);
      }
    });
    
    // Sprawdź zalecane paczki
    recommendations.forEach(rec => {
      if (!allDeps[rec]) {
        recommendedAdditions.push(rec);
      }
    });
    
    // Wyświetl wyniki
    if (outdatedPackages.length > 0) {
      log(`Znaleziono ${outdatedPackages.length} potencjalnie przestarzałych paczek:`, 'warning');
      outdatedPackages.forEach(pkg => console.log(`  - ${pkg}`));
      console.log();
    } else {
      log('Nie znaleziono przestarzałych paczek', 'success');
    }
    
    if (unnecessaryPackages.length > 0) {
      log(`Znaleziono ${unnecessaryPackages.length} potencjalnie zbędnych paczek:`, 'warning');
      unnecessaryPackages.forEach(pkg => console.log(`  - ${pkg}`));
      console.log();
    }
    
    if (recommendedAdditions.length > 0) {
      log(`Zalecane dodatkowe paczki (${recommendedAdditions.length}):`, 'info');
      recommendedAdditions.forEach(pkg => console.log(`  - ${pkg}`));
      console.log();
    }
    
    // Polecenie dla npm do aktualizacji
    if (outdatedPackages.length > 0) {
      log(`Aby sprawdzić przestarzałe paczki, uruchom: npm outdated`, 'info');
      log(`Aby zaktualizować wszystkie paczki, uruchom: npm update`, 'info');
    }
    
    return {
      outdatedPackages,
      securityRisks,
      unnecessaryPackages,
      recommendedAdditions
    };
  } catch (err) {
    log(`Błąd podczas analizy package.json: ${err.message}`, 'error');
    return null;
  }
}

/**
 * Analiza kodu źródłowego pod kątem potencjalnych problemów
 */
function analyzeSourceCode() {
  log('Analizowanie kodu źródłowego', 'header');
  
  const issues = [];
  const improvements = [];
  
  try {
    // Funkcja rekurencyjna do przeszukiwania plików
    function searchDirectory(dir) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory() && file !== 'node_modules' && !file.startsWith('.')) {
          searchDirectory(filePath);
        } else if (stats.isFile() && config.fileExtensions.some(ext => file.endsWith(ext))) {
          // Sprawdź rozmiar pliku
          const fileSizeKB = stats.size / 1024;
          if (fileSizeKB > config.maxFileSize) {
            issues.push({
              file: path.relative(rootDir, filePath),
              type: 'size',
              message: `Duży plik (${fileSizeKB.toFixed(2)} KB), rozważ podział na mniejsze komponenty`
            });
          }
          
          // Sprawdź zawartość pliku
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Wyszukaj import { useState, useEffect, ... } from 'react'
          if (content.includes('import React, {') || content.includes('import { ') && content.includes(' } from "react"')) {
            improvements.push({
              file: path.relative(rootDir, filePath),
              type: 'import',
              message: 'Zalecane importowanie konkretnych hooków bezpośrednio z React'
            });
          }
          
          // Sprawdź, czy duże komponenty używają React.memo
          if (content.includes('export default function') && 
              !content.includes('React.memo') && 
              content.length > 10000) {
            improvements.push({
              file: path.relative(rootDir, filePath),
              type: 'memo',
              message: 'Duży komponent funkcyjny, który może skorzystać z React.memo'
            });
          }
          
          // Sprawdź, czy są bezpośrednie referencje do this.state/props w klasowych komponentach
          if (content.includes('extends React.Component') || content.includes('extends Component')) {
            const hasDestructuring = content.includes('const { ') || content.includes('let { ');
            if (!hasDestructuring && (content.includes('this.props.') || content.includes('this.state.'))) {
              improvements.push({
                file: path.relative(rootDir, filePath),
                type: 'destructuring',
                message: 'Zalecane używanie destrukturyzacji dla this.props i this.state'
              });
            }
          }
          
          // Sprawdź nadmierne używanie useEffect bez zależności
          const useEffectCount = (content.match(/useEffect\(\s*\(\)\s*=>\s*{[^}]*}\s*\)/g) || []).length;
          if (useEffectCount > 3) {
            issues.push({
              file: path.relative(rootDir, filePath),
              type: 'effect',
              message: `Zbyt wiele useEffect bez zależności (${useEffectCount}), może powodować problemy z wydajnością`
            });
          }
          
          // Sprawdź, czy są niepotrzebne console.log
          const logCount = (content.match(/console\.log\(/g) || []).length;
          if (logCount > 0) {
            improvements.push({
              file: path.relative(rootDir, filePath),
              type: 'console',
              message: `Usunięcie ${logCount} niepotrzebnych console.log() w kodzie produkcyjnym`
            });
          }
        }
      });
    }
    
    // Rozpocznij przeszukiwanie od katalogu src
    searchDirectory(srcDir);
    
    // Wyświetl wyniki
    if (issues.length > 0) {
      log(`Znaleziono ${issues.length} potencjalnych problemów:`, 'warning');
      issues.forEach(issue => {
        console.log(`  - ${issue.file}: ${issue.message}`);
      });
      console.log();
    } else {
      log('Nie znaleziono poważnych problemów w kodzie źródłowym', 'success');
    }
    
    if (improvements.length > 0) {
      log(`Sugerowane ulepszenia (${improvements.length}):`, 'info');
      improvements.forEach(improvement => {
        console.log(`  - ${improvement.file}: ${improvement.message}`);
      });
      console.log();
    }
    
    return { issues, improvements };
  } catch (err) {
    log(`Błąd podczas analizy kodu źródłowego: ${err.message}`, 'error');
    return { issues: [], improvements: [] };
  }
}

/**
 * Analiza konfiguracji webpack i opcji budowania
 */
function analyzeBuildConfig() {
  log('Analizowanie konfiguracji budowania', 'header');
  
  try {
    // Sprawdzenie, czy używamy Create React App czy niestandardowej konfiguracji
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const usingCRA = packageJson.dependencies['react-scripts'] || packageJson.devDependencies['react-scripts'];
    const hasCustomWebpack = fs.existsSync(path.join(rootDir, 'webpack.config.js')) || 
                           fs.existsSync(path.join(rootDir, 'craco.config.js')) ||
                           fs.existsSync(path.join(rootDir, 'config-overrides.js'));
    
    if (usingCRA) {
      log('Projekt używa Create React App', 'info');
      
      if (!hasCustomWebpack) {
        log('Nie znaleziono niestandardowej konfiguracji webpack', 'warning');
        log('Zalecane rozszerzenie konfiguracji za pomocą narzędzi takich jak CRACO lub react-app-rewired', 'info');
        
        // Sprawdź, czy mamy .env dla różnych środowisk
        const hasEnvFiles = fs.existsSync(path.join(rootDir, '.env.production')) || 
                          fs.existsSync(path.join(rootDir, '.env.development'));
        
        if (!hasEnvFiles) {
          log('Nie znaleziono plików .env dla różnych środowisk', 'warning');
          log('Zalecane utworzenie plików .env.development i .env.production', 'info');
        }
      } else {
        log('Znaleziono niestandardową konfigurację webpack, co jest dobrą praktyką', 'success');
      }
      
      // Sprawdź, czy mamy analizator bundli
      const hasBundleAnalyzer = packageJson.dependencies['webpack-bundle-analyzer'] || 
                             packageJson.devDependencies['webpack-bundle-analyzer'] ||
                             packageJson.dependencies['source-map-explorer'] ||
                             packageJson.devDependencies['source-map-explorer'];
      
      if (!hasBundleAnalyzer) {
        log('Nie znaleziono narzędzia do analizy rozmiarów bundli', 'warning');
        log('Zalecane dodanie webpack-bundle-analyzer lub source-map-explorer', 'info');
      } else {
        log('Znaleziono narzędzie do analizy bundli, co jest dobrą praktyką', 'success');
      }
      
      // Sprawdź skrypty npm
      const hasAnalyzeScript = packageJson.scripts && 
                            (packageJson.scripts.analyze || 
                             packageJson.scripts['bundle-analyze'] ||
                             packageJson.scripts['build:analyze']);
      
      if (!hasAnalyzeScript) {
        log('Nie znaleziono skryptu do analizy bundli w package.json', 'warning');
        log('Zalecane dodanie skryptu "analyze": "source-map-explorer build/static/js/*.js"', 'info');
      }
    } else if (hasCustomWebpack) {
      log('Projekt używa niestandardowej konfiguracji webpack', 'info');
      
      // Tutaj możemy dodać szczegółową analizę konfiguracji webpack, ale to bardziej zaawansowane
    } else {
      log('Nie znaleziono standardowej konfiguracji budowania', 'warning');
      log('Projekt może używać niestandardowego procesu budowania lub jest niepoprawnie skonfigurowany', 'warning');
    }
    
    // Sprawdź, czy mamy plik .browserslistrc lub pole browserslist w package.json
    const hasBrowserslist = fs.existsSync(path.join(rootDir, '.browserslistrc')) || 
                          (packageJson.browserslist !== undefined);
    
    if (!hasBrowserslist) {
      log('Nie znaleziono konfiguracji browserslist', 'warning');
      log('Zalecane dodanie konfiguracji browserslist do optymalizacji transpilacji', 'info');
    } else {
      log('Znaleziono konfigurację browserslist, co jest dobrą praktyką', 'success');
    }
    
    return {
      usingCRA,
      hasCustomWebpack,
      hasBundleAnalyzer: packageJson.dependencies['webpack-bundle-analyzer'] || 
                       packageJson.devDependencies['webpack-bundle-analyzer'] ||
                       packageJson.dependencies['source-map-explorer'] ||
                       packageJson.devDependencies['source-map-explorer'],
      hasAnalyzeScript: packageJson.scripts && 
                      (packageJson.scripts.analyze || 
                       packageJson.scripts['bundle-analyze'] ||
                       packageJson.scripts['build:analyze']),
      hasBrowserslist
    };
  } catch (err) {
    log(`Błąd podczas analizy konfiguracji budowania: ${err.message}`, 'error');
    return null;
  }
}

/**
 * Analiza użycia lazy loading i code-splitting
 */
function analyzeCodeSplitting() {
  log('Analizowanie podziału kodu (code splitting)', 'header');
  
  try {
    const appFile = path.join(srcDir, 'App.js');
    if (!fs.existsSync(appFile)) {
      log('Nie znaleziono pliku App.js', 'warning');
      return null;
    }
    
    const appContent = fs.readFileSync(appFile, 'utf8');
    
    // Sprawdź, czy używamy React.lazy i Suspense
    const usesLazy = appContent.includes('React.lazy') || appContent.includes('lazy(');
    const usesSuspense = appContent.includes('<Suspense') || appContent.includes('Suspense>');
    
    if (usesLazy && usesSuspense) {
      log('Znaleziono użycie React.lazy i Suspense, co jest dobrą praktyką', 'success');
    } else {
      log('Nie znaleziono użycia React.lazy i/lub Suspense', 'warning');
      log('Zalecane wprowadzenie leniwego ładowania dla komponentów na różnych ścieżkach', 'info');
    }
    
    // Sprawdź, które komponenty są ładowane leniwie
    const lazyComponents = [];
    const regex = /(?:const|let|var)\s+(\w+)\s*=\s*(?:React\.)?lazy\(\s*\(\)\s*=>\s*import\(['"](.+)['"]\)\s*\)/g;
    let match;
    
    while ((match = regex.exec(appContent)) !== null) {
      lazyComponents.push({
        name: match[1],
        path: match[2]
      });
    }
    
    if (lazyComponents.length > 0) {
      log(`Znaleziono ${lazyComponents.length} leniwie ładowanych komponentów:`, 'info');
      lazyComponents.forEach(comp => {
        console.log(`  - ${comp.name} (${comp.path})`);
      });
      console.log();
    }
    
    // Sprawdź, czy wszystkie zalecane komponenty są ładowane leniwie
    const missingLazy = config.componentsToLazyLoad
      .filter(comp => !lazyComponents.some(lc => lc.name === comp));
    
    if (missingLazy.length > 0) {
      log(`Znaleziono ${missingLazy.length} komponenty, które powinny być ładowane leniwie:`, 'warning');
      missingLazy.forEach(comp => {
        console.log(`  - ${comp}`);
      });
      console.log();
      log('Zalecane użycie React.lazy() dla tych komponentów', 'info');
    }
    
    return {
      usesLazy,
      usesSuspense,
      lazyComponents,
      missingLazy
    };
  } catch (err) {
    log(`Błąd podczas analizy podziału kodu: ${err.message}`, 'error');
    return null;
  }
}

/**
 * Analiza ustawień produkcyjnych
 */
function analyzeProductionSettings() {
  log('Analizowanie ustawień produkcyjnych', 'header');
  
  try {
    // Sprawdź, czy istnieje plik .env.production
    const hasEnvProduction = fs.existsSync(path.join(rootDir, '.env.production'));
    if (!hasEnvProduction) {
      log('Nie znaleziono pliku .env.production', 'warning');
      log('Zalecane utworzenie pliku .env.production z ustawieniami produkcyjnymi', 'info');
    } else {
      log('Znaleziono plik .env.production, co jest dobrą praktyką', 'success');
    }
    
    // Sprawdź, czy istnieje plik .htaccess dla hostingu Apache
    const hasHtaccess = fs.existsSync(path.join(rootDir, 'public', '.htaccess'));
    if (!hasHtaccess) {
      log('Nie znaleziono pliku .htaccess dla obsługi routingu na serwerach Apache', 'warning');
      log('Zalecane utworzenie pliku .htaccess dla aplikacji produkcyjnej', 'info');
    } else {
      log('Znaleziono plik .htaccess, co jest dobrą praktyką dla hostingu na Apache', 'success');
    }
    
    // Sprawdź, czy istnieje plik robots.txt
    const hasRobotsTxt = fs.existsSync(path.join(rootDir, 'public', 'robots.txt'));
    if (!hasRobotsTxt) {
      log('Nie znaleziono pliku robots.txt', 'warning');
      log('Zalecane utworzenie pliku robots.txt dla lepszej indeksacji przez wyszukiwarki', 'info');
    } else {
      log('Znaleziono plik robots.txt, co jest dobrą praktyką', 'success');
    }
    
    // Sprawdź, czy istnieje manifest.json z odpowiednimi polami
    const hasManifest = fs.existsSync(path.join(rootDir, 'public', 'manifest.json'));
    if (hasManifest) {
      try {
        const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'public', 'manifest.json'), 'utf8'));
        
        // Sprawdź wymagane pola
        const requiredFields = ['name', 'short_name', 'icons', 'start_url', 'display'];
        const missingFields = requiredFields.filter(field => !manifest[field]);
        
        if (missingFields.length > 0) {
          log(`W pliku manifest.json brakuje wymaganych pól: ${missingFields.join(', ')}`, 'warning');
        } else {
          log('Plik manifest.json zawiera wszystkie wymagane pola, co jest dobrą praktyką', 'success');
        }
      } catch (err) {
        log(`Błąd podczas analizy pliku manifest.json: ${err.message}`, 'error');
      }
    } else {
      log('Nie znaleziono pliku manifest.json', 'warning');
      log('Zalecane utworzenie poprawnego pliku manifest.json dla PWA', 'info');
    }
    
    return {
      hasEnvProduction,
      hasHtaccess,
      hasRobotsTxt,
      hasManifest
    };
  } catch (err) {
    log(`Błąd podczas analizy ustawień produkcyjnych: ${err.message}`, 'error');
    return null;
  }
}

/**
 * Analiza całej aplikacji i generowanie raportu
 */
function analyzeApp() {
  log('NARZĘDZIE DO OPTYMALIZACJI MARKETPLACE FRONTEND', 'header');
  console.log(chalk.bold('Wersja 1.0.0 - Lipiec 2025'));
  console.log('');
  
  // Przeprowadź wszystkie analizy
  const dependencies = analyzeDependencies();
  const sourceCode = analyzeSourceCode();
  const buildConfig = analyzeBuildConfig();
  const codeSplitting = analyzeCodeSplitting();
  const productionSettings = analyzeProductionSettings();
  
  // Generuj podsumowanie
  log('PODSUMOWANIE ANALIZY', 'header');
  
  // Liczba problemów i sugestii
  const issues = [
    ...(sourceCode?.issues || []),
    ...(dependencies?.outdatedPackages || []),
    ...(dependencies?.securityRisks || []),
    ...(codeSplitting?.missingLazy || [])
  ];
  
  const suggestions = [
    ...(sourceCode?.improvements || []),
    ...(dependencies?.unnecessaryPackages || []),
    ...(dependencies?.recommendedAdditions || [])
  ];
  
  console.log(chalk.bold(`Znaleziono ${issues.length} problemów i ${suggestions.length} sugestii optymalizacyjnych.`));
  
  // Generuj listę najważniejszych działań
  console.log('');
  log('NAJWAŻNIEJSZE ZALECANE DZIAŁANIA:', 'header');
  
  const topActions = [];
  
  // Problemy z podziałem kodu
  if (codeSplitting && (!codeSplitting.usesLazy || !codeSplitting.usesSuspense)) {
    topActions.push('Wprowadź leniwe ładowanie komponentów (React.lazy i Suspense) dla lepszej wydajności ładowania');
  }
  
  // Brak analizatora bundli
  if (buildConfig && !buildConfig.hasBundleAnalyzer) {
    topActions.push('Dodaj narzędzie do analizy rozmiarów bundli (webpack-bundle-analyzer lub source-map-explorer)');
  }
  
  // Duże pliki
  const largeFiles = sourceCode?.issues?.filter(issue => issue.type === 'size') || [];
  if (largeFiles.length > 0) {
    topActions.push(`Podziel ${largeFiles.length} dużych plików na mniejsze komponenty dla lepszej maintainability`);
  }
  
  // Komponenty, które powinny być ładowane leniwie
  if (codeSplitting && codeSplitting.missingLazy && codeSplitting.missingLazy.length > 0) {
    topActions.push(`Wprowadź leniwe ładowanie dla ${codeSplitting.missingLazy.length} komponentów: ${codeSplitting.missingLazy.join(', ')}`);
  }
  
  // Brak ustawień produkcyjnych
  if (productionSettings && !productionSettings.hasEnvProduction) {
    topActions.push('Utwórz plik .env.production z optymalnymi ustawieniami dla środowiska produkcyjnego');
  }
  
  // Wyświetl najważniejsze działania
  if (topActions.length > 0) {
    topActions.forEach((action, index) => {
      console.log(`${index + 1}. ${action}`);
    });
  } else {
    console.log(chalk.green('Nie znaleziono krytycznych problemów do rozwiązania. Dobra robota!'));
  }
  
  console.log('');
  log('Analiza zakończona!', 'success');
  console.log(chalk.gray('Aby uzyskać bardziej szczegółowe informacje, uruchom z opcją --analyze'));
}

// Uruchom analizę, jeśli skrypt jest uruchamiany bezpośrednio
if (require.main === module) {
  // Parsuj argumenty wiersza poleceń
  const args = process.argv.slice(2);
  const options = {
    analyze: args.includes('--analyze'),
    optimize: args.includes('--optimize'),
    clean: args.includes('--clean')
  };
  
  // Domyślnie uruchom analizę
  if (!options.analyze && !options.optimize && !options.clean) {
    analyzeApp();
  } else {
    // Tutaj można dodać dodatkowe funkcje dla innych opcji
    if (options.analyze) {
      analyzeApp();
    }
    
    if (options.optimize) {
      log('Funkcja automatycznej optymalizacji nie jest jeszcze zaimplementowana', 'warning');
    }
    
    if (options.clean) {
      log('Funkcja czyszczenia nie jest jeszcze zaimplementowana', 'warning');
    }
  }
}

// Eksportuj funkcje do użycia w innych skryptach
module.exports = {
  analyzeDependencies,
  analyzeSourceCode,
  analyzeBuildConfig,
  analyzeCodeSplitting,
  analyzeProductionSettings,
  analyzeApp
};
