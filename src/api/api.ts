import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Deals API
export const dealsApi = {
  getDeals: (page: number, limit: number, search: string) => 
    api.get(`/deals?page=${page}&limit=${limit}&search=${search}`),
  getDeal: (id: string) => api.get(`/deals/${id}`),
  createDeal: (deal: any) => api.post('/deals', deal),
  updateDeal: (id: string, deal: any) => api.put(`/deals/${id}`, deal),
  deleteDeal: (id: string) => api.delete(`/deals/${id}`),
};

// Documents API
export const documentsApi = {
  getDocuments: (page: number, limit: number, search: string) => 
    api.get(`/documents?page=${page}&limit=${limit}&search=${search}`),
  getDocument: (id: string) => api.get(`/documents/${id}`),
  uploadDocument: (formData: FormData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteDocument: (id: string) => api.delete(`/documents/${id}`),
};

// Prospects API
export const prospectsApi = {
  getProspects: (page: number, limit: number, search: string) => 
    api.get(`/prospects?page=${page}&limit=${limit}&search=${search}`),
  getProspect: (id: string) => api.get(`/prospects/${id}`),
  createProspect: (prospect: any) => api.post('/prospects', prospect),
  updateProspect: (id: string, prospect: any) => api.put(`/prospects/${id}`, prospect),
  deleteProspect: (id: string) => api.delete(`/prospects/${id}`),
};

// Tenants API
export const tenantsApi = {
  getTenants: (page: number, limit: number, search: string) => 
    api.get(`/tenants?page=${page}&limit=${limit}&search=${search}`),
  getTenant: (id: string) => api.get(`/tenants/${id}`),
  createTenant: (tenant: any) => api.post('/tenants', tenant),
  updateTenant: (id: string, tenant: any) => api.put(`/tenants/${id}`, tenant),
  deleteTenant: (id: string) => api.delete(`/tenants/${id}`),
};

export default api;