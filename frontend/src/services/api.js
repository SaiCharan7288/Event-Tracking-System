import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let mouseMoveTimeout;

// Queue an event
export const queueEvent = async (eventData) => {
  try {
    if (eventData.eventType === 'mousemove') {
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
      return new Promise((resolve) => {
        mouseMoveTimeout = setTimeout(async () => {
          const response = await api.post('/events', eventData);
          resolve(response.data);
        }, 500);
      });
    }
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Failed to queue event:', error);
    throw error;
  }
};

// Fetch events
export const fetchEvents = async (params = {}) => {
  try {
    const response = await api.get('/events', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

// Fetch stats
export const fetchStats = async () => {
  try {
    const response = await api.get('/events/stats/summary');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    throw error;
  }
};

// ✅ CLEAR EVENTS - THIS WAS MISSING!
export const clearEvents = async () => {
  try {
    const response = await api.delete('/events');
    return response.data;
  } catch (error) {
    console.error('Failed to clear events:', error);
    throw error;
  }
};

// ✅ ALSO EXPORT DEFAULT IF NEEDED
export default api;