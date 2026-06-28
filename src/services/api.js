import axios from 'axios';

// In a real app, this would be your backend URL (e.g. process.env.NEXT_PUBLIC_API_URL)
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
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

// MOCK DATA LAYER
// For the purpose of the client-side assignment, we will use mock data if the API fails, 
// or simply use this layer to simulate responses if no backend is running.
let mockUsers = [
  { _id: '1', name: 'Admin User', email: 'admin@blood.com', role: 'admin', status: 'active', avatar: 'https://i.ibb.co/68v1r52/admin.png' },
  { _id: '2', name: 'John Donor', email: 'donor@blood.com', role: 'donor', status: 'active', bloodGroup: 'O+', district: 'Dhaka', upazila: 'Savar', avatar: 'https://i.ibb.co/68v1r52/donor.png' },
  { _id: '3', name: 'Jane Volunteer', email: 'volunteer@blood.com', role: 'volunteer', status: 'active', avatar: 'https://i.ibb.co/68v1r52/volunteer.png' }
];

let mockDonationRequests = [
  { _id: '101', requesterName: 'John Donor', requesterEmail: 'donor@blood.com', recipientName: 'Patient A', recipientDistrict: 'Dhaka', recipientUpazila: 'Savar', hospitalName: 'Dhaka Medical', fullAddress: 'Ward 5, Bed 12', bloodGroup: 'A+', donationDate: '2026-07-01', donationTime: '10:00 AM', requestMessage: 'Urgent surgery', donationStatus: 'pending' },
  { _id: '102', requesterName: 'John Donor', requesterEmail: 'donor@blood.com', recipientName: 'Patient B', recipientDistrict: 'Chittagong', recipientUpazila: 'Hathazari', hospitalName: 'Chittagong Medical', fullAddress: 'ICU', bloodGroup: 'O-', donationDate: '2026-07-05', donationTime: '02:00 PM', requestMessage: 'Accident case', donationStatus: 'inprogress', donorInfo: { name: 'Alice Good', email: 'alice@test.com' } }
];

// Mock API functions for UI development
export const authService = {
  login: async (credentials) => {
    const user = mockUsers.find(u => u.email === credentials.email);
    if (user) {
      if (user.status === 'blocked') throw new Error('User is blocked');
      // Simulate JWT token structure
      const mockToken = btoa(JSON.stringify({ email: user.email, role: user.role }));
      return { data: { token: mockToken, user } };
    }
    throw new Error('Invalid credentials');
  },
  register: async (userData) => {
    const newUser = { ...userData, _id: Date.now().toString(), role: 'donor', status: 'active' };
    mockUsers.push(newUser);
    const mockToken = btoa(JSON.stringify({ email: newUser.email, role: newUser.role }));
    return { data: { token: mockToken, user: newUser } };
  }
};

export const donationService = {
  getPendingRequests: async () => {
    return { data: mockDonationRequests.filter(r => r.donationStatus === 'pending') };
  },
  getAllRequests: async () => {
    return { data: mockDonationRequests };
  },
  getMyRequests: async (email) => {
    return { data: mockDonationRequests.filter(r => r.requesterEmail === email) };
  },
  createRequest: async (requestData) => {
    const newReq = { ...requestData, _id: Date.now().toString(), donationStatus: 'pending' };
    mockDonationRequests.unshift(newReq);
    return { data: newReq };
  },
  updateRequestStatus: async (id, status, donorInfo = null) => {
    const req = mockDonationRequests.find(r => r._id === id);
    if (req) {
      req.donationStatus = status;
      if (donorInfo) req.donorInfo = donorInfo;
    }
    return { data: req };
  }
};

export const userService = {
  getAllUsers: async () => {
    return { data: mockUsers };
  },
  updateUserRole: async (id, role) => {
    const user = mockUsers.find(u => u._id === id);
    if (user) user.role = role;
    return { data: user };
  },
  updateUserStatus: async (id, status) => {
    const user = mockUsers.find(u => u._id === id);
    if (user) user.status = status;
    return { data: user };
  }
};

let mockPayments = [
  { _id: '201', userId: '2', amount: 50, date: '2026-06-25' },
  { _id: '202', userId: '3', amount: 100, date: '2026-06-26' }
];

export const paymentService = {
  getAllPayments: async () => {
    return { data: mockPayments };
  }
};

export default api;
