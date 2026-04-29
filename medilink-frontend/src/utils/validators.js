export function validateHealthId(value) {
  return /^\d{14}$/.test(String(value || '').trim());
}

export function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}
