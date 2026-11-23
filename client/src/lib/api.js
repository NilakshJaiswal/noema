import axios from 'axios';

// In dev, Vite proxies /api → http://localhost:5000 (see vite.config.js).
// In prod, set VITE_API_BASE to your API origin, or serve both from one domain.
const baseURL = import.meta.env.VITE_API_BASE || '';

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export async function submitContact(payload) {
  const { data } = await client.post('/api/contact', payload);
  return data;
}

export default client;
