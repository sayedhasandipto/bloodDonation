import axios from 'axios';

// The Express server URL
const API_URL = 'https://blood-donation-server-one-rho.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token if needed later
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  }
};

// DONATION SERVICE via EXPRESS
export const donationService = {
  getPendingRequests: async () => {
    // A more advanced backend would have a filter query parameter
    const res = await api.get('/donations');
    const pending = res.data?.data?.filter(r => r.donationStatus === 'pending') || [];
    return { data: pending };
  },
  getAllRequests: async () => {
    const res = await api.get('/donations');
    return res.data;
  },
  getMyRequests: async (email) => {
    const res = await api.get(`/donations/my-requests/${email}`);
    return res.data;
  },
  createRequest: async (requestData) => {
    const res = await api.post('/donations', requestData);
    return res.data;
  },
  updateRequestStatus: async (id, status, donorInfo = null) => {
    const res = await api.patch(`/donations/${id}/status`, { status, donorInfo });
    return res.data;
  },
  deleteRequest: async (id) => {
    const res = await api.delete(`/donations/${id}`);
    return res.data;
  },
  getRequestById: async (id) => {
    const res = await api.get(`/donations/${id}`);
    return res.data;
  },
  updateRequest: async (id, requestData) => {
    const res = await api.patch(`/donations/${id}`, requestData);
    return res.data;
  }
};

// USER SERVICE via EXPRESS
export const userService = {
  getAllUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  getPublicDonors: async () => {
    const res = await api.get('/donors');
    return res.data;
  },
  updateUserRole: async (id, role) => {
    const res = await api.patch(`/users/${id}/role`, { role });
    return res.data;
  },
  updateUserStatus: async (id, status) => {
    const res = await api.patch(`/users/${id}/status`, { status });
    return res.data;
  },
  updateProfile: async (id, profileData) => {
    const res = await api.patch(`/users/${id}`, profileData);
    return res.data;
  }
};

// FUNDING SERVICE via EXPRESS
export const paymentService = {
  getAllPayments: async () => {
    const res = await api.get('/funds');
    return res.data;
  },
  createPayment: async (fundData) => {
    const res = await api.post('/funds', fundData);
    return res.data;
  }
};

export default api;
