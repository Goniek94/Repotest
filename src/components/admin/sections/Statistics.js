// src/components/admin/sections/Statistics.js
/**
 * Komponent do wyświetlania statystyk w panelu administratora
 * Component for displaying statistics in admin panel
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaCarAlt, FaExclamationTriangle, FaEye, FaComments, FaHeart } from 'react-icons/fa';

// Komponent karty statystycznej
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 flex items-center ${color}`}>
      <div className="rounded-full p-3 mr-4 bg-opacity-20">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

// Komponent wykresu
const Chart = ({ title, data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t" 
              style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
            ></div>
            <span className="text-xs mt-2 text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Statistics = () => {
  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    reports: 0,
    views: 0,
    messages: 0,
    favorites: 0
  });
  
  const [chartData, setChartData] = useState({
    listings: [],
    users: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie statystyk
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/statistics');
        
        setStats(response.data.stats);
        setChartData(response.data.chartData);
        setLoading(false);
      } catch (err) {
        setError('Wystąpił błąd podczas pobierania statystyk.');
        setLoading(false);
        console.error('Error fetching statistics:', err);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Błąd!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // Przykładowe dane dla wykresów (do zastąpienia danymi z API)
  const sampleListingsData = [
    { label: 'Pon', value: 12 },
    { label: 'Wt', value: 19 },
    { label: 'Śr', value: 15 },
    { label: 'Czw', value: 22 },
    { label: 'Pt', value: 30 },
    { label: 'Sob', value: 18 },
    { label: 'Nd', value: 10 }
  ];

  const sampleUsersData = [
    { label: 'Pon', value: 5 },
    { label: 'Wt', value: 8 },
    { label: 'Śr', value: 12 },
    { label: 'Czw', value: 7 },
    { label: 'Pt', value: 15 },
    { label: 'Sob', value: 10 },
    { label: 'Nd', value: 6 }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Statystyki</h1>
      
      {/* Karty statystyczne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Użytkownicy" 
          value={stats.users} 
          icon={<FaUsers className="text-blue-500 text-xl" />} 
          color="text-blue-500"
        />
        <StatCard 
          title="Ogłoszenia" 
          value={stats.listings} 
          icon={<FaCarAlt className="text-green-500 text-xl" />} 
          color="text-green-500"
        />
        <StatCard 
          title="Zgłoszenia" 
          value={stats.reports} 
          icon={<FaExclamationTriangle className="text-yellow-500 text-xl" />} 
          color="text-yellow-500"
        />
        <StatCard 
          title="Wyświetlenia" 
          value={stats.views} 
          icon={<FaEye className="text-purple-500 text-xl" />} 
          color="text-purple-500"
        />
        <StatCard 
          title="Wiadomości" 
          value={stats.messages} 
          icon={<FaComments className="text-indigo-500 text-xl" />} 
          color="text-indigo-500"
        />
        <StatCard 
          title="Ulubione" 
          value={stats.favorites} 
          icon={<FaHeart className="text-red-500 text-xl" />} 
          color="text-red-500"
        />
      </div>
      
      {/* Wykresy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart 
          title="Nowe ogłoszenia (ostatni tydzień)" 
          data={chartData.listings.length > 0 ? chartData.listings : sampleListingsData} 
        />
        <Chart 
          title="Nowi użytkownicy (ostatni tydzień)" 
          data={chartData.users.length > 0 ? chartData.users : sampleUsersData} 
        />
      </div>
    </div>
  );
};

export default Statistics;
