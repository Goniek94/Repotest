const STORAGE_KEY = 'userActivities';

function getActivities() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Błąd wczytywania aktywności:', e);
    return [];
  }
}

function saveActivities(activities) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch (e) {
    console.error('Błąd zapisu aktywności:', e);
  }
}

function addActivity(activity) {
  const current = getActivities();
  const updated = [activity, ...current].slice(0, 5);
  saveActivities(updated);
  return updated;
}

function logLogin(user) {
  const activity = {
    id: Date.now(),
    icon: 'log-in',
    title: 'Zalogowano do systemu',
    description: user?.email || 'Użytkownik zalogował się',
    time: new Date().toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    href: '#',
    actionLabel: 'OK'
  };
  addActivity(activity);
}

export default {
  getActivities,
  addActivity,
  logLogin
};
