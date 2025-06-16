# Dokumentacja komponentów responsywnych

Ten dokument zawiera informacje o responsywnych komponentach dostępnych w projekcie, ich właściwościach i przykładach użycia.

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Hook useBreakpoint](#hook-usebreakpoint)
3. [Komponenty układu](#komponenty-układu)
   - [ResponsiveContainer](#responsivecontainer)
   - [ResponsiveGrid](#responsivegrid)
   - [ResponsiveFlex](#responsiveflex)
   - [ResponsiveStack](#responsivestack)
4. [Komponenty UI](#komponenty-ui)
   - [ResponsiveCard](#responsivecard)
   - [Typography](#typography)
5. [Przykłady użycia](#przykłady-użycia)
6. [Najlepsze praktyki](#najlepsze-praktyki)

## Wprowadzenie

Komponenty responsywne zostały zaprojektowane, aby ułatwić tworzenie interfejsów, które dobrze wyglądają na różnych urządzeniach. Wykorzystują one Tailwind CSS i automatycznie dostosowują się do różnych rozmiarów ekranu.

## Hook useBreakpoint

Hook `useBreakpoint` pozwala na wykrywanie aktualnego breakpointu i dostosowywanie komponentów do różnych rozmiarów ekranu.

```jsx
import useBreakpoint from '../../utils/responsive/useBreakpoint';

const MyComponent = () => {
  const { 
    breakpoint,      // 'mobile', 'tablet', 'laptop', 'desktop'
    dimensions,      // { width, height }
    isMobile,        // true/false
    isTablet,        // true/false
    isLaptop,        // true/false
    isDesktop,       // true/false
    isMobileOrTablet, // true/false
    isLaptopOrDesktop // true/false
  } = useBreakpoint();
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isLaptopOrDesktop && <DesktopView />}
    </div>
  );
};
```

Breakpointy:
- `mobile`: 0-639px
- `tablet`: 640-1023px
- `laptop`: 1024-1279px
- `desktop`: 1280px+

## Komponenty układu

### ResponsiveContainer

Kontener, który automatycznie dostosowuje się do różnych rozmiarów ekranu.

```jsx
import { ResponsiveContainer } from '../layout';

<ResponsiveContainer>
  {/* Zawartość */}
</ResponsiveContainer>
```

Właściwości:
- `children`: Zawartość kontenera
- `fluid`: Czy kontener ma być pełnej szerokości (true) czy z maksymalną szerokością (false, domyślnie)
- `className`: Dodatkowe klasy CSS
- `as`: Element HTML, który ma być użyty (domyślnie div)

### ResponsiveGrid

Siatka, która automatycznie dostosowuje liczbę kolumn do różnych rozmiarów ekranu.

```jsx
import { ResponsiveGrid } from '../layout';

<ResponsiveGrid cols={3} gap={4}>
  <div>Element 1</div>
  <div>Element 2</div>
  <div>Element 3</div>
</ResponsiveGrid>
```

Właściwości:
- `children`: Zawartość siatki
- `cols`: Liczba kolumn (domyślnie { default: 1, sm: 2, md: 3, lg: 4 })
  - Może być liczbą (np. 3) lub obiektem (np. { default: 1, sm: 2, md: 3, lg: 4 })
- `gap`: Odstęp między elementami (domyślnie 4)
- `className`: Dodatkowe klasy CSS

### ResponsiveFlex

Flex kontener, który automatycznie dostosowuje układ do różnych rozmiarów ekranu.

```jsx
import { ResponsiveFlex } from '../layout';

<ResponsiveFlex direction="responsive" justify="between" align="center">
  <div>Element 1</div>
  <div>Element 2</div>
</ResponsiveFlex>
```

Właściwości:
- `children`: Zawartość kontenera
- `direction`: Kierunek układu (domyślnie "row")
  - Może być stringiem (np. "row", "col", "responsive") lub obiektem (np. { default: "col", md: "row" })
  - "responsive" to skrót dla "col" na mobile i "row" na większych ekranach
- `justify`: Wyrównanie w osi głównej (domyślnie "start")
  - Dostępne wartości: "start", "end", "center", "between", "around", "evenly"
- `align`: Wyrównanie w osi poprzecznej (domyślnie "start")
  - Dostępne wartości: "start", "end", "center", "baseline", "stretch"
- `wrap`: Czy elementy mają zawijać się do nowej linii (domyślnie false)
- `gap`: Odstęp między elementami (domyślnie 4)
- `className`: Dodatkowe klasy CSS

### ResponsiveStack

Stos elementów (układ pionowy) z różnymi odstępami na różnych rozmiarach ekranu.

```jsx
import { ResponsiveStack } from '../layout';

<ResponsiveStack gap={{ default: 2, md: 4, lg: 6 }}>
  <div>Element 1</div>
  <div>Element 2</div>
  <div>Element 3</div>
</ResponsiveStack>
```

Właściwości:
- `children`: Zawartość stosu
- `gap`: Odstęp między elementami (domyślnie 4)
  - Może być liczbą (np. 4) lub obiektem (np. { default: 2, md: 4, lg: 6 })
- `className`: Dodatkowe klasy CSS

## Komponenty UI

### ResponsiveCard

Karta z automatycznym dostosowaniem paddingu do różnych rozmiarów ekranu.

```jsx
import { ResponsiveCard } from '../ui';

<ResponsiveCard padding="md" shadow="md" rounded="md">
  {/* Zawartość karty */}
</ResponsiveCard>
```

Właściwości:
- `children`: Zawartość karty
- `padding`: Rozmiar paddingu (domyślnie "md")
  - Dostępne wartości: "none", "sm", "md", "lg"
- `shadow`: Rozmiar cienia (domyślnie "md")
  - Dostępne wartości: "none", "sm", "md", "lg"
- `rounded`: Zaokrąglenie rogów (domyślnie "md")
  - Dostępne wartości: "none", "sm", "md", "lg", "full"
- `className`: Dodatkowe klasy CSS

### Typography

Komponenty typograficzne, które automatycznie dostosowują rozmiar tekstu do różnych rozmiarów ekranu.

```jsx
import { Heading1, Heading2, Heading3, Heading4, Text, LabeledText } from '../ui';

<>
  <Heading1>Nagłówek H1</Heading1>
  <Heading2>Nagłówek H2</Heading2>
  <Heading3>Nagłówek H3</Heading3>
  <Heading4>Nagłówek H4</Heading4>
  <Text>Zwykły tekst</Text>
  <Text size="responsive">Responsywny tekst</Text>
  <LabeledText label="Etykieta">Wartość</LabeledText>
</>
```

Właściwości dla Heading1, Heading2, Heading3, Heading4:
- `children`: Zawartość nagłówka
- `className`: Dodatkowe klasy CSS

Właściwości dla Text:
- `children`: Zawartość tekstu
- `size`: Rozmiar tekstu (domyślnie "base")
  - Dostępne wartości: "xs", "sm", "base", "lg", "xl", "responsive"
- `className`: Dodatkowe klasy CSS

Właściwości dla LabeledText:
- `label`: Etykieta
- `children`: Zawartość
- `className`: Dodatkowe klasy CSS

## Przykłady użycia

### Przykład 1: Responsywny układ strony

```jsx
import { ResponsiveContainer, ResponsiveGrid } from '../layout';
import { ResponsiveCard, Heading1 } from '../ui';

const PageLayout = () => {
  return (
    <ResponsiveContainer>
      <Heading1 className="mb-6">Tytuł strony</Heading1>
      
      <ResponsiveGrid cols={{ default: 1, md: 2 }} gap={6}>
        <ResponsiveCard>
          {/* Zawartość lewej kolumny */}
        </ResponsiveCard>
        
        <ResponsiveCard>
          {/* Zawartość prawej kolumny */}
        </ResponsiveCard>
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
};
```

### Przykład 2: Responsywny formularz

```jsx
import { ResponsiveContainer, ResponsiveStack } from '../layout';
import { ResponsiveCard, Heading2, Text } from '../ui';

const ContactForm = () => {
  return (
    <ResponsiveContainer>
      <ResponsiveCard className="max-w-md mx-auto">
        <Heading2 className="mb-4">Formularz kontaktowy</Heading2>
        
        <ResponsiveStack gap={4}>
          <div>
            <label className="block mb-1">Imię i nazwisko</label>
            <input type="text" className="w-full border rounded px-3 py-2" />
          </div>
          
          <div>
            <label className="block mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" />
          </div>
          
          <div>
            <label className="block mb-1">Wiadomość</label>
            <textarea className="w-full border rounded px-3 py-2" rows={4}></textarea>
          </div>
          
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Wyślij</button>
        </ResponsiveStack>
      </ResponsiveCard>
    </ResponsiveContainer>
  );
};
```

### Przykład 3: Responsywna lista elementów

```jsx
import { ResponsiveContainer, ResponsiveGrid } from '../layout';
import { ResponsiveCard, Heading2, Text } from '../ui';
import useBreakpoint from '../../utils/responsive/useBreakpoint';

const ItemsList = ({ items }) => {
  const { isMobile } = useBreakpoint();
  
  return (
    <ResponsiveContainer>
      <Heading2 className="mb-4">Lista elementów</Heading2>
      
      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap={4}>
        {items.map((item) => (
          <ResponsiveCard key={item.id} className="h-full">
            <div className={isMobile ? "flex-col" : "flex items-center"}>
              <img src={item.image} alt={item.name} className="w-16 h-16 mr-4 mb-2" />
              <div>
                <Text className="font-bold">{item.name}</Text>
                <Text size="sm">{item.description}</Text>
              </div>
            </div>
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
};
```

## Najlepsze praktyki

1. **Używaj komponentów układu** zamiast ręcznego pisania klas Tailwind CSS.
2. **Korzystaj z hooka useBreakpoint** do warunkowego renderowania komponentów.
3. **Testuj na różnych urządzeniach** lub używaj narzędzi deweloperskich do symulacji różnych rozmiarów ekranu.
4. **Zacznij od wersji mobilnej** i stopniowo dostosowuj do większych ekranów.
5. **Używaj predefiniowanych rozmiarów** dla paddingów, marginesów, cieni itp.
6. **Unikaj hardkodowania wartości** - używaj zmiennych i predefiniowanych klas.
7. **Grupuj powiązane elementy** w komponenty wyższego poziomu.
8. **Używaj ResponsiveContainer** jako głównego kontenera dla treści.
9. **Używaj ResponsiveGrid** do tworzenia siatek elementów.
10. **Używaj ResponsiveFlex** do układów, które mają zmieniać kierunek na różnych rozmiarach ekranu.
