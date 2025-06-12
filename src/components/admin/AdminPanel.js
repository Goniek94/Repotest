import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import authService from '../../services/auth';

/**
 * Pojedynczy komponent panelu administratora z podstawowymi funkcjami:
 *  - Dashboard ze statystykami i listą aktywności
 *  - Zarządzanie użytkownikami (rola, ban)
 *  - Moderacja ogłoszeń (approve/reject)
 *  - Obsługa zgłoszeń
 *  - Podstawowy audit log i wylogowanie
 */
const AdminPanel = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);

  // przykładowe dane
  const [users, setUsers] = useState([
    { id: 1, email: 'jan@example.com', role: 'user', banned: false },
    { id: 2, email: 'ola@example.com', role: 'moderator', banned: false },
  ]);
  const [listings, setListings] = useState([
    { id: 1, title: 'Audi A4', status: 'pending' },
    { id: 2, title: 'BMW M3', status: 'pending' },
  ]);
  const [reports, setReports] = useState([
    { id: 1, title: 'Spam w komentarzach', category: 'spam', resolved: false },
  ]);
  const [auditLog, setAuditLog] = useState([]);

  const stats = {
    users: users.length,
    listings: listings.length,
    reports: reports.filter(r => !r.resolved).length,
  };

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      navigate('/login');
      return;
    }
    setUserData(currentUser);
  }, [navigate]);

  const logAction = (description) => {
    setAuditLog(prev => [...prev, { description, time: new Date().toLocaleString() }]);
  };

  const changeRole = (id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    logAction(`Zmieniono rolę użytkownika ${id} na ${newRole}`);
  };

  const toggleBan = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, banned: !u.banned } : u));
    logAction(`Użytkownik ${id} ${users.find(u => u.id === id)?.banned ? 'odblokowany' : 'zablokowany'}`);
  };

  const approveListing = (id) => {
    setListings(prev => prev.filter(l => l.id !== id));
    logAction(`Zatwierdzono ogłoszenie ${id}`);
  };

  const rejectListing = (id) => {
    setListings(prev => prev.filter(l => l.id !== id));
    logAction(`Odrzucono ogłoszenie ${id}`);
  };

  const resolveReport = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, resolved: true } : r));
    logAction(`Zamknięto zgłoszenie ${id}`);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <div className={`fixed top-0 left-0 h-full bg-[#35530A] text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
      <div className="flex items-center gap-3 p-4 border-b border-[#2D4A06]">
        <div className="w-10 h-10 bg-white text-[#35530A] flex items-center justify-center rounded font-bold">LOGO</div>
        <h2 className="font-bold uppercase">AutoSell.PL</h2>
      </div>
      <nav className="mt-4">
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase">Panel administratora</h3>
          <ul className="mt-2 space-y-1">
            <li><button onClick={() => setActiveTab('dashboard')} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-[#2D4A06] rounded">Dashboard</button></li>
            <li><button onClick={() => setActiveTab('users')} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-[#2D4A06] rounded">Użytkownicy</button></li>
            <li><button onClick={() => setActiveTab('listings')} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-[#2D4A06] rounded">Ogłoszenia</button></li>
            <li><button onClick={() => setActiveTab('reports')} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-[#2D4A06] rounded">Zgłoszenia</button></li>
          </ul>
        </div>
        <div className="px-4 py-2 mt-4">
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-300 hover:bg-[#2D4A06] rounded">
            <FaSignOutAlt /> Wyloguj
          </button>
        </div>
      </nav>
    </div>
  );

  const TopBar = () => (
    <div className="fixed top-0 left-0 right-0 bg-white h-16 shadow-md z-20 flex items-center justify-between px-4">
      <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-[#35530A] p-2 hover:bg-gray-100 rounded">
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      {userData && <span className="font-medium">{userData.email}</span>}
    </div>
  );

  const DashboardTab = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">Użytkownicy: {stats.users}</div>
        <div className="bg-white p-4 rounded shadow">Ogłoszenia w kolejce: {stats.listings}</div>
        <div className="bg-white p-4 rounded shadow">Otwarte zgłoszenia: {stats.reports}</div>
      </div>
      <h2 className="text-xl font-bold mb-2">Audit log</h2>
      <div className="bg-white rounded shadow divide-y">
        {auditLog.map((entry, idx) => (
          <div key={idx} className="p-2 text-sm flex justify-between">
            <span>{entry.description}</span>
            <span className="text-gray-500">{entry.time}</span>
          </div>
        ))}
        {auditLog.length === 0 && <div className="p-2 text-gray-500 text-sm">Brak akcji</div>}
      </div>
    </div>
  );

  const UsersTab = () => {
    const [search, setSearch] = useState('');
    const filtered = users.filter(u => u.email.includes(search));
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Użytkownicy</h2>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj" className="border p-1 mb-4" />
        <table className="min-w-full bg-white rounded shadow">
          <thead><tr><th className="p-2">Email</th><th className="p-2">Rola</th><th className="p-2">Status</th><th className="p-2">Akcje</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} className="border p-1">
                    <option value="user">user</option>
                    <option value="moderator">moderator</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-2">{u.banned ? 'zablokowany' : 'aktywny'}</td>
                <td className="p-2"><button onClick={() => toggleBan(u.id)} className="text-blue-600">{u.banned ? 'Odblokuj' : 'Zablokuj'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const ListingsTab = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Nowe ogłoszenia</h2>
      {listings.map(l => (
        <div key={l.id} className="bg-white rounded shadow p-3 mb-2 flex justify-between">
          <span>{l.title}</span>
          <div className="space-x-2">
            <button onClick={() => approveListing(l.id)} className="text-green-600">Zatwierdź</button>
            <button onClick={() => rejectListing(l.id)} className="text-red-600">Odrzuć</button>
          </div>
        </div>
      ))}
      {listings.length === 0 && <p className="text-gray-500">Brak ogłoszeń do moderacji</p>}
    </div>
  );

  const ReportsTab = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Zgłoszenia</h2>
      {reports.map(r => (
        <div key={r.id} className="bg-white rounded shadow p-3 mb-2 flex justify-between">
          <div>
            <p className="font-semibold">{r.title}</p>
            <p className="text-sm text-gray-500">{r.category}</p>
          </div>
          <button onClick={() => resolveReport(r.id)} className="text-blue-600">Zamknij</button>
        </div>
      ))}
      {reports.length === 0 && <p className="text-gray-500">Brak zgłoszeń</p>}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab />;
      case 'listings':
        return <ListingsTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <TopBar />
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} pt-16`}>
        {renderTab()}
      </main>
    </div>
  );
};

export default AdminPanel;
