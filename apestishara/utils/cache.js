
export const setSessionCache = (key, data, ttlMinutes = 10) => {
    const payload = {
      data,
      expiry: new Date().getTime() + ttlMinutes * 60 * 1000,
    };
    sessionStorage.setItem(key, JSON.stringify(payload));
  };
  
  export const getSessionCache = (key) => {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
  
    try {
      const parsed = JSON.parse(cached);
      if (new Date().getTime() > parsed.expiry) {
        sessionStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch (e) {
      sessionStorage.removeItem(key);
      return null;
    }
  };
  