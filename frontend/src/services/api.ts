import axios from 'axios';
import {
    RegisterUserData,
    LoginData,
    User,
    Bank,
    CreateBankData,
    Branch,
    CreateBranchData,
    ATM,
    CreateATMData,
    ApiResponse,
    PaginatedResponse
} from '../types/api';

const API_URL = 'http://localhost:9000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        return Promise.reject(error);
    }
);

// Authentication API - matches your auth.router.js
export const authApi = {
    register: (data: RegisterUserData) => api.post<ApiResponse<User>>('/api/atm_locator/auth/register', data),
    activateUserProfile: (token: string) => api.get<ApiResponse<User>>(`/api/atm_locator/auth/activate/${token}`),
    login: (data: LoginData) => api.post<ApiResponse<{ token: string; user: User }>>('/api/atm_locator/auth/login', data),
    getLoggedInUserProfile: () => api.post<ApiResponse<User>>('/api/atm_locator/auth/me'),
    logout: () => api.patch<ApiResponse>('/api/atm_locator/auth/logout'),
};

// Bank API - matches your bank.router.js
export const bankApi = {
    // Public endpoints
    getBanksForHome: () => api.get<ApiResponse<Bank[]>>('/api/atm_locator/bank/for-home'),
    getAllBanks: () => api.get<ApiResponse<Bank[]>>('/api/atm_locator/bank'),
    
    // Protected endpoints
    getBankById: (id: string) => api.get<ApiResponse<Bank>>(`/api/atm_locator/bank/${id}`),
    updateBank: (id: string, data: CreateBankData) => api.put<ApiResponse<Bank>>(`/api/atm_locator/bank/${id}`, data),
    deleteBank: (id: string) => api.delete<ApiResponse>(`/api/atm_locator/bank/${id}`),
    getBranchesByBankSlug: (slug: string) => api.get<ApiResponse<Branch[]>>(`/api/atm_locator/bank/branches/${slug}`),
    createBank: (data: CreateBankData) => api.post<ApiResponse<Bank>>('/api/atm_locator/bank', data),
};

// Branch API - matches your branch.router.js
export const branchApi = {
    // Public endpoints
    getBranchesForHome: () => api.get<ApiResponse<Branch[]>>('/api/atm_locator/branch/for-home'),
    getAllBranches: () => api.get<ApiResponse<Branch[]>>('/api/atm_locator/branch'),
    
    // Protected endpoints
    getBranchById: (id: string) => api.get<ApiResponse<Branch>>(`/api/atm_locator/branch/${id}`),
    updateBranch: (id: string, data: CreateBranchData) => api.put<ApiResponse<Branch>>(`/api/atm_locator/branch/${id}`, data),
    deleteBranch: (id: string) => api.delete<ApiResponse>(`/api/atm_locator/branch/${id}`),
    getATMsByBranchId: (id: string) => api.get<ApiResponse<ATM[]>>(`/api/atm_locator/branch/atms/${id}`),
    createBranch: (data: CreateBranchData) => api.post<ApiResponse<Branch>>('/api/atm_locator/branch', data),
};

// ATM API - matches your atm.router.js
export const atmApi = {
    // Public endpoints
    getATMsForHome: () => api.get<ApiResponse<ATM[]>>('/api/atm_locator/atm/for-home'),
    getAllATMs: () => api.get<ApiResponse<ATM[]>>('/api/atm_locator/atm'),
    
    // Protected endpoints
    getBranchesByAtmSlug: (slug: string) => api.get<ApiResponse<Branch[]>>(`/api/atm_locator/atm/${slug}/branches`),
    getATMById: (id: string) => api.get<ApiResponse<ATM>>(`/api/atm_locator/atm/${id}`),
    updateATM: (id: string, data: CreateATMData) => api.put<ApiResponse<ATM>>(`/api/atm_locator/atm/${id}`, data),
    deleteATM: (id: string) => api.delete<ApiResponse>(`/api/atm_locator/atm/${id}`),
    createATM: (data: CreateATMData) => api.post<ApiResponse<ATM>>('/api/atm_locator/atm', data),
};

// Root API - matches your router.config.js
export const rootApi = {
    getHome: () => api.get<ApiResponse>('/api/atm_locator/'),
};

export default api; 