export function formatNumber(num) {
  return num.toLocaleString();
}

export function calculateProgress(current, target) {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

export function generateId() {
  return `c-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
