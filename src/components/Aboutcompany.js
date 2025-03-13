import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHandshake, FaChartLine, FaAward } from 'react-icons/fa';
import { GiEarthAmerica } from 'react-icons/gi';

const AboutCompany = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const teamMembers = [
    { name: 'Jan Kowalski', position: 'CEO', img: '/team1.jpg' },
    { name: 'Anna Nowak', position: 'CTO', img: '/team2.jpg' },
    { name: 'Piotr Wiśniewski', position: 'CMO', img: '/team3.jpg' },
    { name: 'Maria Zielińska', position: 'CFO', img: '/team4.jpg' },
  ];

  const milestones = [
    { year: '2010', title: 'Powstanie firmy', description: 'Rozpoczęliśmy działalność jako mały lokalny dealer' },
    { year: '2014', title: 'Pierwsza nagroda', description: 'Zdobycie tytułu Najlepszego Dealera w regionie' },
    { year: '2018', title: 'Ekspansja', description: 'Otwarcie 5 nowych oddziałów w Polsce' },
    { year: '2023', title: 'Nowa era', description: 'Uruchomienie platformy internetowej' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative h-96 flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="/about-hero.jpg" 
            alt="Nasza flota" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <motion.div 
          variants={slideUp}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Poznaj naszą historię</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Od małego dealera do lidera rynku motoryzacyjnego
          </p>
        </motion.div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Nasza misja
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dostarczamy kompleksowe rozwiązania motoryzacyjne, łącząc nowoczesną technologię 
              z osobistym podejściem do każdego klienta. Naszym celem jest tworzenie 
              wyjątkowych doświadczeń w świecie motoryzacji.
            </p>
            <div className="flex items-center space-x-4">
              <FaHandshake className="w-12 h-12 text-green-600" />
              <span className="text-xl font-semibold">Zaufanie to podstawa</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-xl overflow-hidden shadow-xl"
          >
            <img 
              src="/mission.jpg" 
              alt="Nasze wartości" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <FaUsers className="w-8 h-8" />, title: 'Zadowolonych klientów', value: '50K+' },
            { icon: <GiEarthAmerica className="w-8 h-8" />, title: 'Oddziałów', value: '15' },
            { icon: <FaChartLine className="w-8 h-8" />, title: 'Średnia ocena', value: '4.9/5' },
            { icon: <FaAward className="w-8 h-8" />, title: 'Nagród branżowych', value: '23' },
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="mb-4">{item.icon}</div>
              <div className="text-4xl font-bold mb-2">{item.value}</div>
              <div className="text-gray-200">{item.title}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Poznaj nasz zespół
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative text-center"
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.position}</p>
                <div className="flex justify-center space-x-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Tutaj możesz dodać ikony social media */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nasza historia</h2>
          <div className="relative">
            <div className="absolute left-1/2 w-1 bg-gray-200 h-full -translate-x-1/2 hidden md:block" />
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`mb-8 md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center w-full`}
              >
                <div className="md:w-1/2 md:px-8">
                  <div className={`p-6 bg-white rounded-xl shadow-md ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="text-green-600 font-bold text-lg">{milestone.year}</div>
                    <h3 className="text-xl font-semibold mt-2">{milestone.title}</h3>
                    <p className="text-gray-600 mt-2">{milestone.description}</p>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white text-center">
        <motion.div 
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Dołącz do naszej społeczności</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Gotowy na wyjątkowe doświadczenia motoryzacyjne? Skontaktuj się z nami już dziś!
          </p>
          <button className="bg-white text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
            Skontaktuj się z nami
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutCompany;