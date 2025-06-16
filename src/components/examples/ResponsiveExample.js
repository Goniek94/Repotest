import React from 'react';
import { 
  ResponsiveContainer, 
  ResponsiveGrid, 
  ResponsiveFlex, 
  ResponsiveStack 
} from '../layout';
import { 
  ResponsiveCard,
  Heading1, 
  Heading2, 
  Heading3, 
  Text, 
  LabeledText 
} from '../ui';
import useBreakpoint from '../../utils/responsive/useBreakpoint';

/**
 * Przykładowy komponent pokazujący użycie responsywnych komponentów
 * 
 * @returns {JSX.Element}
 */
const ResponsiveExample = () => {
  const { breakpoint, isMobile, isTablet, isLaptop, isDesktop } = useBreakpoint();
  
  return (
    <ResponsiveContainer>
      <Heading1 className="mb-6">Przykłady responsywnych komponentów</Heading1>
      
      {/* Informacje o aktualnym breakpoincie */}
      <ResponsiveCard className="mb-8">
        <Heading3 className="mb-4">Aktualny breakpoint: <span className="text-green-600">{breakpoint}</span></Heading3>
        <ResponsiveFlex gap={4} wrap={true}>
          <div className={`px-3 py-1 rounded-full ${isMobile ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>Mobile</div>
          <div className={`px-3 py-1 rounded-full ${isTablet ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>Tablet</div>
          <div className={`px-3 py-1 rounded-full ${isLaptop ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>Laptop</div>
          <div className={`px-3 py-1 rounded-full ${isDesktop ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>Desktop</div>
        </ResponsiveFlex>
      </ResponsiveCard>
      
      {/* Przykład ResponsiveGrid */}
      <Heading2 className="mb-4">ResponsiveGrid</Heading2>
      <Text className="mb-4">
        Siatka automatycznie dostosowuje liczbę kolumn do rozmiaru ekranu:
        1 kolumna na mobile, 2 na tablet, 3 na laptop, 4 na desktop.
      </Text>
      <ResponsiveGrid className="mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <ResponsiveCard key={item} className="h-32 flex items-center justify-center">
            Element {item}
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>
      
      {/* Przykład ResponsiveFlex */}
      <Heading2 className="mb-4">ResponsiveFlex</Heading2>
      <Text className="mb-4">
        Flex kontener zmienia kierunek z pionowego na poziomy na większych ekranach.
      </Text>
      <ResponsiveFlex direction="responsive" gap={4} className="mb-8">
        <ResponsiveCard className="flex-1 p-4">
          <Heading3 className="mb-2">Panel lewy</Heading3>
          <Text>Ten panel będzie na górze na małych ekranach i po lewej na dużych.</Text>
        </ResponsiveCard>
        <ResponsiveCard className="flex-1 p-4">
          <Heading3 className="mb-2">Panel prawy</Heading3>
          <Text>Ten panel będzie na dole na małych ekranach i po prawej na dużych.</Text>
        </ResponsiveCard>
      </ResponsiveFlex>
      
      {/* Przykład ResponsiveStack */}
      <Heading2 className="mb-4">ResponsiveStack</Heading2>
      <Text className="mb-4">
        Stack układa elementy pionowo z różnymi odstępami na różnych rozmiarach ekranu.
      </Text>
      <ResponsiveStack gap={{ default: 2, md: 4, lg: 6 }} className="mb-8">
        <ResponsiveCard>
          <Heading3>Element 1</Heading3>
          <Text>Odstęp między elementami rośnie wraz z rozmiarem ekranu.</Text>
        </ResponsiveCard>
        <ResponsiveCard>
          <Heading3>Element 2</Heading3>
          <Text>Odstęp między elementami rośnie wraz z rozmiarem ekranu.</Text>
        </ResponsiveCard>
        <ResponsiveCard>
          <Heading3>Element 3</Heading3>
          <Text>Odstęp między elementami rośnie wraz z rozmiarem ekranu.</Text>
        </ResponsiveCard>
      </ResponsiveStack>
      
      {/* Przykład typografii */}
      <Heading2 className="mb-4">Responsywna typografia</Heading2>
      <ResponsiveCard className="mb-8">
        <Heading1 className="mb-2">Nagłówek H1</Heading1>
        <Heading2 className="mb-2">Nagłówek H2</Heading2>
        <Heading3 className="mb-2">Nagłówek H3</Heading3>
        <Text size="xs" className="mb-1">Text XS</Text>
        <Text size="sm" className="mb-1">Text SM</Text>
        <Text size="base" className="mb-1">Text Base</Text>
        <Text size="lg" className="mb-1">Text LG</Text>
        <Text size="xl" className="mb-1">Text XL</Text>
        <Text size="responsive" className="mb-1">Text Responsive</Text>
        
        <div className="mt-4">
          <LabeledText label="Etykieta" className="mb-2">Wartość</LabeledText>
          <LabeledText label="Długa etykieta z przykładem" className="mb-2">
            Ta etykieta będzie nad wartością na małych ekranach i obok na dużych.
          </LabeledText>
        </div>
      </ResponsiveCard>
    </ResponsiveContainer>
  );
};

export default ResponsiveExample;
