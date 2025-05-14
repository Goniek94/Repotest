# System Responsywności w Marketplace

Ten dokument opisuje system responsywności zaimplementowany w aplikacji Marketplace. System ten umożliwia tworzenie responsywnych komponentów, które dostosowują się do różnych rozmiarów ekranu.

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Struktura systemu](#struktura-systemu)
3. [Hook useResponsive](#hook-useresponsive)
4. [Kontekst ResponsiveContext](#kontekst-responsivecontext)
5. [Komponenty UI](#komponenty-ui)
6. [Przykłady użycia](#przykłady-użycia)
7. [Najlepsze praktyki](#najlepsze-praktyki)

## Wprowadzenie

System responsywności został zaprojektowany, aby ułatwić tworzenie interfejsu użytkownika, który dobrze wygląda i działa na różnych urządzeniach - od telefonów komórkowych po duże monitory. System opiera się na:

- Hooku `useResponsive`, który dostarcza informacje o rozmiarze ekranu
- Kontekście `ResponsiveContext`, który udostępnia te informacje wszystkim komponentom
- Zestawie komponentów UI, które wykorzystują te informacje do dostosowania swojego wyglądu

## Struktura systemu

```
src/
├── hooks/
│   └── useResponsive.js       # Hook dostarczający informacje o rozmiarze ekranu
├── contexts/
│   └── ResponsiveContext.js   # Kontekst udostępniający informacje o rozmiarze ekranu
└── components/
    └── ui/                    # Komponenty UI wykorzystujące responsywność
        ├── Container.js       # Responsywny kontener
        ├── Grid.js            # Responsywna siatka
        ├── Flex.js            # Responsywny flex
        ├── Hidden.js          # Komponent do ukrywania/pokazywania zawartości
        ├── Text.js            # Responsywny tekst
        ├── Button.js          # Responsywny przycisk
        ├── Card.js            # Responsywna karta
        └── index.js           # Eksport wszystkich komponentów UI
```

## Hook useResponsive

Hook `useResponsive` dostarcza informacje o rozmiarze ekranu i breakpointach. Breakpointy są zgodne z Tailwind CSS:

- xs: 0px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

Hook zwraca obiekt zawierający:

- `width`: Szerokość ekranu
- `height`: Wysokość ekranu
- `isMobile`: Czy ekran jest mobilny (< 640px)
- `isTablet`: Czy ekran jest tabletem (640px - 1024px)
- `isDesktop`: Czy ekran jest desktopem (1024px - 1280px)
- `isLargeDesktop`: Czy ekran jest dużym desktopem (>= 1280px)
- `breakpoint`: Aktualny breakpoint (xs, sm, md, lg, xl, 2xl)
- `breakpoints`: Obiekt zawierający wszystkie breakpointy
- `isBreakpoint(breakpoint)`: Funkcja sprawdzająca, czy aktualny breakpoint to `breakpoint`
- `isUpTo(breakpoint)`: Funkcja sprawdzająca, czy szerokość ekranu jest mniejsza niż `breakpoint`
- `isFrom(breakpoint)`: Funkcja sprawdzająca, czy szerokość ekranu jest większa lub równa `breakpoint`
- `isBetween(minBreakpoint, maxBreakpoint)`: Funkcja sprawdzająca, czy szerokość ekranu jest między `minBreakpoint` a `maxBreakpoint`

Przykład użycia:

```jsx
import useResponsive from '../hooks/useResponsive';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  
  return (
    <div>
      {isMobile && <div>Widok mobilny</div>}
      {isTablet && <div>Widok tabletowy</div>}
      {isDesktop && <div>Widok desktopowy</div>}
      {isLargeDesktop && <div>Widok dużego desktopa</div>}
    </div>
  );
};
```

## Kontekst ResponsiveContext

Kontekst `ResponsiveContext` udostępnia informacje o rozmiarze ekranu wszystkim komponentom w aplikacji. Jest to wrapper wokół hooka `useResponsive`.

Przykład użycia:

```jsx
import { useResponsiveContext } from '../contexts/ResponsiveContext';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsiveContext();
  
  return (
    <div>
      {isMobile && <div>Widok mobilny</div>}
      {isTablet && <div>Widok tabletowy</div>}
      {isDesktop && <div>Widok desktopowy</div>}
      {isLargeDesktop && <div>Widok dużego desktopa</div>}
    </div>
  );
};
```

## Komponenty UI

System responsywności zawiera zestaw komponentów UI, które wykorzystują informacje o rozmiarze ekranu do dostosowania swojego wyglądu. Wszystkie komponenty są dostępne poprzez import z `components/ui`:

```jsx
import { Container, Grid, Flex, Hidden, Text, Button, Card } from '../components/ui';
```

### Container

Komponent `Container` dostosowuje swoją szerokość i padding w zależności od rozmiaru ekranu.

```jsx
<Container>
  Zawartość kontenera
</Container>

<Container fluid>
  Kontener na pełną szerokość
</Container>

<Container noPadding>
  Kontener bez paddingu
</Container>
```

### Grid

Komponent `Grid` dostosowuje liczbę kolumn w zależności od rozmiaru ekranu.

```jsx
<Grid cols={3} mdCols={2} smCols={1} gap={4}>
  <GridItem>Element 1</GridItem>
  <GridItem>Element 2</GridItem>
  <GridItem>Element 3</GridItem>
</Grid>

<Grid cols={4} gap={2}>
  <GridItem span={2}>Element zajmujący 2 kolumny</GridItem>
  <GridItem>Element 2</GridItem>
  <GridItem>Element 3</GridItem>
</Grid>
```

### Flex

Komponent `Flex` dostosowuje swoje właściwości w zależności od rozmiaru ekranu.

```jsx
<Flex direction="row" mdDirection="column" smDirection="column" gap={4}>
  <FlexItem>Element 1</FlexItem>
  <FlexItem>Element 2</FlexItem>
  <FlexItem>Element 3</FlexItem>
</Flex>

<Flex justify="between" align="center">
  <FlexItem>Element 1</FlexItem>
  <FlexItem>Element 2</FlexItem>
  <FlexItem>Element 3</FlexItem>
</Flex>
```

### Hidden

Komponent `Hidden` ukrywa lub pokazuje zawartość w zależności od rozmiaru ekranu.

```jsx
<Hidden mobile>
  Ten element jest ukryty na urządzeniach mobilnych
</Hidden>

<Hidden desktop>
  Ten element jest ukryty na desktopach
</Hidden>

<Hidden only="sm">
  Ten element jest widoczny tylko na ekranach sm
</Hidden>
```

### Text

Komponent `Text` dostosowuje rozmiar, wagę i inne właściwości tekstu w zależności od rozmiaru ekranu.

```jsx
<Text variant="h1">Nagłówek 1</Text>
<Text variant="body1">Tekst podstawowy</Text>
<Text variant="caption" color="gray">Podpis</Text>
<Text variant="h2" align="center" color="primary">Wyśrodkowany nagłówek 2</Text>
```

### Button

Komponent `Button` dostosowuje swój wygląd w zależności od rozmiaru ekranu.

```jsx
<Button>Przycisk podstawowy</Button>
<Button variant="outline">Przycisk z obramowaniem</Button>
<Button variant="text">Przycisk tekstowy</Button>
<Button size="lg" fullWidth>Duży przycisk na pełną szerokość</Button>
```

### Card

Komponent `Card` dostosowuje swój wygląd w zależności od rozmiaru ekranu.

```jsx
<Card>
  <CardHeader>Nagłówek karty</CardHeader>
  <CardBody>Zawartość karty</CardBody>
  <CardFooter>Stopka karty</CardFooter>
</Card>

<Card variant="primary" hoverable>
  <CardBody>Karta z efektem najechania</CardBody>
</Card>
```

## Przykłady użycia

### Responsywny układ strony

```jsx
import { Container, Grid, GridItem, Card, CardBody, Text } from '../components/ui';

const HomePage = () => {
  return (
    <Container>
      <Text variant="h1" align="center" className="my-4">Strona główna</Text>
      
      <Grid cols={3} mdCols={2} smCols={1} gap={4}>
        <GridItem>
          <Card hoverable>
            <CardBody>
              <Text variant="h3">Karta 1</Text>
              <Text variant="body1">Zawartość karty 1</Text>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card hoverable>
            <CardBody>
              <Text variant="h3">Karta 2</Text>
              <Text variant="body1">Zawartość karty 2</Text>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card hoverable>
            <CardBody>
              <Text variant="h3">Karta 3</Text>
              <Text variant="body1">Zawartość karty 3</Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Container>
  );
};
```

### Responsywny komponent z różnymi widokami

```jsx
import { useResponsiveContext } from '../contexts/ResponsiveContext';
import { Card, CardBody, Text, Flex, FlexItem, Hidden } from '../components/ui';

const ProductCard = ({ product }) => {
  const { isMobile } = useResponsiveContext();
  
  return (
    <Card hoverable>
      <CardBody>
        <Flex direction={isMobile ? 'column' : 'row'} gap={4}>
          <FlexItem>
            <img src={product.image} alt={product.name} className="w-full h-auto" />
          </FlexItem>
          <FlexItem>
            <Text variant="h3">{product.name}</Text>
            <Text variant="body1">{product.description}</Text>
            
            <Hidden mobile>
              <Text variant="body2" className="mt-2">Dodatkowe informacje widoczne tylko na większych ekranach</Text>
            </Hidden>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
};
```

## Najlepsze praktyki

### 1. Używaj komponentów UI zamiast bezpośrednio klas Tailwind

Zamiast:

```jsx
<div className={`text-lg md:text-xl lg:text-2xl ${isMobile ? 'text-center' : 'text-left'}`}>
  Tytuł
</div>
```

Użyj:

```jsx
<Text variant="h3" align={isMobile ? 'center' : 'left'}>
  Tytuł
</Text>
```

### 2. Używaj kontekstu ResponsiveContext zamiast hooka useResponsive

Zamiast importować hook `useResponsive` w każdym komponencie, używaj kontekstu `ResponsiveContext`, który jest dostępny w całej aplikacji.

### 3. Projektuj mobile-first

Zawsze zaczynaj od projektowania dla urządzeń mobilnych, a następnie dostosowuj dla większych ekranów. Jest to zgodne z podejściem Tailwind CSS.

### 4. Unikaj hardcodowania wartości pikselowych

Zamiast hardcodować wartości pikselowe, używaj jednostek relatywnych (rem, em) lub klas Tailwind.

### 5. Testuj na różnych urządzeniach

Zawsze testuj swoje komponenty na różnych urządzeniach i rozmiarach ekranu, aby upewnić się, że wyglądają dobrze i działają poprawnie.

### 6. Używaj komponentu Hidden do ukrywania/pokazywania zawartości

Zamiast używać warunków w JSX do ukrywania/pokazywania zawartości, używaj komponentu `Hidden`, który jest bardziej czytelny i łatwiejszy w utrzymaniu.

### 7. Używaj komponentów Grid i Flex do układu

Zamiast tworzyć własne układy, używaj komponentów `Grid` i `Flex`, które są już zoptymalizowane pod kątem responsywności.

### 8. Unikaj zagnieżdżania wielu komponentów responsywnych

Unikaj zagnieżdżania wielu komponentów responsywnych, ponieważ może to prowadzić do nieprzewidywalnych wyników. Zamiast tego, staraj się używać jednego komponentu responsywnego na poziom.

### 9. Używaj props className do dostosowywania komponentów

Wszystkie komponenty UI akceptują prop `className`, który pozwala na dodanie własnych klas Tailwind do komponentu.

```jsx
<Button className="mt-4 shadow-lg">Przycisk z własnymi klasami</Button>
```

### 10. Dokumentuj swoje komponenty

Zawsze dokumentuj swoje komponenty, aby inni programiści mogli łatwo zrozumieć, jak ich używać.
