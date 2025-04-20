export const setSessionCache = (key, data, ttlMinutes = 10) => {
  const payload = {
    data,
    expiry: new Date().getTime() + ttlMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(payload));
};

export const getSessionCache = (key) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    if (new Date().getTime() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    localStorage.removeItem(key);
    return null;
  }
};
