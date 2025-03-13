import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaRegLightbulb } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'account', name: 'Konto', color: 'bg-blue-100 text-blue-800' },
    { id: 'listings', name: 'Ogłoszenia', color: 'bg-green-100 text-green-800' },
    { id: 'payments', name: 'Płatności', color: 'bg-purple-100 text-purple-800' },
  ];

  const faqs = [
    {
      question: 'Jak dodać ogłoszenie?',
      answer: 'Przejdź do zakładki "Dodaj ogłoszenie", wypełnij formularz z podstawowymi informacjami i dodaj atrakcyjne zdjęcia. Po weryfikacji, ogłoszenie pojawi się w wynikach wyszukiwania.',
      category: 'listings',
      tags: ['dodawanie', 'formularz']
    },
    {
      question: 'Jak edytować istniejące ogłoszenie?',
      answer: 'W sekcji "Moje ogłoszenia" znajdź interesujące Cię ogłoszenie i kliknij ikonę ołówka. Pamiętaj, że po zmianach ogłoszenie będzie wymagało ponownej moderacji.',
      category: 'listings',
      tags: ['edycja', 'moderacja']
    },
    {
      question: 'Jakie metody płatności są dostępne?',
      answer: 'Akceptujemy płatności przez Przelewy24, PayPal oraz tradycyjne przelewy bankowe. Płatności kryptowalutami w przygotowaniu!',
      category: 'payments',
      tags: ['płatności', 'przelew']
    },
    {
      question: 'Jak usunąć konto?',
      answer: 'W ustawieniach konta znajdziesz opcję "Usuń konto". Usunięcie jest możliwe tylko gdy nie masz aktywnych ogłoszeń.',
      category: 'account',
      tags: ['bezpieczeństwo', 'usuwanie']
    },
    {
      question: 'Jak zgłosić nieprawidłowe ogłoszenie?',
      answer: 'Kliknij ikonę flagi na karcie ogłoszenia i wybierz powód zgłoszenia. Nasz zespół moderacyjny rozpatrzy zgłoszenie w ciągu 24h.',
      category: 'listings',
      tags: ['zgłoszenia', 'moderacja']
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-16"
      >
        <div className="inline-block bg-green-100 rounded-full p-3 mb-6">
          <FaRegLightbulb className="w-12 h-12 text-green-600" />
        </div>
        <motion.h1 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Centrum Pomocy
        </motion.h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Znajdź odpowiedzi na najczęściej zadawane pytania lub skontaktuj się z naszym wsparciem
        </p>
      </motion.div>

      {/* Wyszukiwarka i filtry */}
      <div className="max-w-3xl mx-auto mb-12 space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Wyszukaj w pytaniach..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === 'all' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } transition-colors`}
          >
            Wszystkie
          </button>
          {faqCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.id 
                  ? `${category.color} opacity-100` 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista FAQ */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filteredFaqs.map((faq, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none group"
              aria-expanded={activeIndex === index}
            >
              <div className="flex items-start space-x-4">
                <span className={`${faqCategories.find(c => c.id === faq.category)?.color} px-3 py-1 rounded-full text-sm font-medium`}>
                  {faqCategories.find(c => c.id === faq.category)?.name}
                </span>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 pr-4 text-left">
                  {faq.question}
                </h2>
              </div>
              <span className="text-green-600 ml-2 transform transition-transform group-hover:scale-125">
                {activeIndex === index ? (
                  <FaChevronUp className="w-5 h-5" />
                ) : (
                  <FaChevronDown className="w-5 h-5" />
                )}
              </span>
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed md:text-lg mb-4">
                      {faq.answer}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {faq.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Sekcja dodatkowej pomocy */}
      <div className="max-w-3xl mx-auto mt-16 text-center border-t border-gray-200 pt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Nie znalazłeś odpowiedzi?</h3>
        <p className="text-gray-600 mb-6">
          Nasz zespół wsparcia jest dostępny 24/7
        </p>
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
          Skontaktuj się z nami
        </button>
      </div>
    </div>
  );
};

export default FAQ;