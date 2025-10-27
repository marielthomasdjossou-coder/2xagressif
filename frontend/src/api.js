import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API = `${API_BASE}/api`;

// Dedicated axios instance for app API (excludes login special-case issues)
const apiClient = axios.create({ baseURL: API });

// Axios interceptor for protected routes: on 401/403, clear token and redirect
apiClient.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    // Do NOT redirect on login endpoint to allow UI to show proper message
    if ((status === 401 || status === 403) && !url.endsWith('/login')) {
      localStorage.removeItem('token');
      window.location.assign('/admin');
    }
    return Promise.reject(error);
  }
);

export function imageUrl(rel) {
  if (!rel) return '';
  if (/^https?:\/\//i.test(rel)) return rel;
  // rel expected like "uploads/filename.jpg"
  return `${API_BASE}/${rel}`;
}

export async function getParfums(){
  const { data } = await apiClient.get(`/parfums`);
  return data;
}

export async function getParfum(id){
  const { data } = await apiClient.get(`/parfums/${id}`);
  return data;
}

export async function getParfumsPaged(page = 0, limit = 12){
  const offset = page * limit;
  const { data } = await apiClient.get(`/parfums`, { params: { limit, offset } });
  // When backend is old, it may return an array. Normalize.
  if (Array.isArray(data)) {
    return { items: data, total: data.length, limit, offset };
  }
  return data; // { items, total, limit, offset }
}

export async function login(username, password){
  // Use base axios (without redirect interceptor) so UI can show validation errors
  const { data } = await axios.post(`${API}/login`, { username, password });
  return data;
}

export async function createParfum({ nom, prix, description, details, imageFile }){
  const token = localStorage.getItem('token');
  const form = new FormData();
  form.append('nom', nom);
  form.append('prix', prix);
  if (description) form.append('description', description);
  if (details) form.append('details', details);
  if (imageFile) form.append('image', imageFile);
  const { data } = await apiClient.post(`/parfums`, form, { headers: { 'Authorization': `Bearer ${token}` } });
  return data;
}

export async function updateParfum(id, payload){
  const token = localStorage.getItem('token');
  const form = new FormData();
  // Map known fields explicitly
  if (payload.nom !== undefined && payload.nom !== null) form.append('nom', payload.nom);
  if (payload.prix !== undefined && payload.prix !== null) form.append('prix', payload.prix);
  if (payload.description !== undefined && payload.description !== null) form.append('description', payload.description);
  if (payload.details !== undefined && payload.details !== null) form.append('details', payload.details);
  // IMPORTANT: backend expects field name 'image', not 'imageFile'
  if (payload.imageFile) form.append('image', payload.imageFile);
  const { data } = await apiClient.put(`/parfums/${id}`, form, { headers: { 'Authorization': `Bearer ${token}` } });
  return data;
}

export async function deleteParfum(id){
  const token = localStorage.getItem('token');
  const { data } = await apiClient.delete(`/parfums/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
  return data;
}

