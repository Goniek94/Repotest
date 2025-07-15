const STORAGE_KEY = 'userActivities';

function getKey(userId) {
  return `${STORAGE_KEY}_${userId}`;
}

function getActivities(userId) {
  if (!userId) return [];
  try {
    const data = localStorage.getItem(getKey(userId));
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Błąd wczytywania aktywności:', e);
    return [];
  }
}

function saveActivities(userId, activities) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId), JSON.stringify(activities));
  } catch (e) {
    console.error('Błąd zapisu aktywności:', e);
  }
}

function addActivity(activity, userId) {
  if (!userId) return [];
  const current = getActivities(userId);
  const updated = [activity, ...current].slice(0, 5);
  saveActivities(userId, updated);
  return updated;
}

function logLogin(user) {
  if (!user?.id) return;
  
  const activity = {
    id: Date.now(),
    iconType: 'log-in', // Zmieniono z 'icon' na 'iconType'
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
  
  addActivity(activity, user.id);
}

export default {
  getActivities,
  addActivity,
  logLogin
};
