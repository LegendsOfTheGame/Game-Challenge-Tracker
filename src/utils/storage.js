const STORAGE_KEY = 'apex-tracker-data';

export function initializeStorage() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const defaultData = {
      version: '1.0.0',
      currentGame: 'apex',
      apex: {
        currentWeek: null,
        archivedWeeks: []
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(existing);
}

export function getCurrentWeek() {
  const data = initializeStorage();
  return data.apex.currentWeek;
}

export function saveCurrentWeek(weekData) {
  const data = initializeStorage();
  data.apex.currentWeek = {
    ...weekData,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
