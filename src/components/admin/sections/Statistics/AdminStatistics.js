import React, { useState, useEffect } from 'react';
import { Download, Calendar } from 'lucide-react';
import StatisticsCharts from './StatisticsCharts';
import StatisticsCards from './StatisticsCards';
import StatisticsExport from './StatisticsExport';
import AdminButton from '../../components/UI/AdminButton';
import AdminSelect from '../../components/Forms/AdminSelect';
import useAdminApi from '../../hooks/useAdminApi';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const AdminStatistics = () => {
  const [statsData, setStatsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [showExport, setShowExport] = useState(false);

  const { get } = useAdminApi();
  const { showError } = useAdminNotifications();

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await get('/statistics', { timeRange });
      if (response.success) {
        setStatsData(response.data);
      }
    } catch (err) {
      showError('Nie udało się załadować statystyk');
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: 'last_7_days', label: 'Ostatnie 7 dni' },
    { value: 'last_30_days', label: 'Ostatnie 30 dni' },
    { value: 'last_90_days', label: 'Ostatnie 90 dni' },
    { value: 'this_year', label: 'Ten rok' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statystyki</h1>
          <p className="text-gray-600">Przegląd danych i analityk</p>
        </div>
        <div className="flex items-center space-x-3">
          <AdminSelect
            value={timeRange}
            onChange={setTimeRange}
            options={timeRangeOptions}
            size="small"
          />
          <AdminButton
            variant="secondary"
            icon={Download}
            onClick={() => setShowExport(true)}
          >
            Eksportuj
          </AdminButton>
        </div>
      </div>

      {/* Statistics cards */}
      <StatisticsCards data={statsData.cards} loading={loading} />

      {/* Charts */}
      <StatisticsCharts data={statsData.charts} loading={loading} />

      {/* Export modal */}
      {showExport && (
        <StatisticsExport
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          timeRange={timeRange}
        />
      )}
    </div>
  );
};

export default AdminStatistics;
