// Authentication Types
export interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    isActive: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
}

// Bank Types
export interface Bank {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    description?: string;
    website?: string;
    contactNumber?: string;
    email?: string;
    address?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBankData {
    name: string;
    logo?: string;
    description?: string;
    website?: string;
    contactNumber?: string;
    email?: string;
    address?: string;
}

// Branch Types
export interface Branch {
    _id: string;
    name: string;
    slug: string;
    bankId: string;
    bank?: Bank;
    address: string;
    contactNumber?: string;
    email?: string;
    manager?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBranchData {
    name: string;
    bankId: string;
    address: string;
    contactNumber?: string;
    email?: string;
    manager?: string;
}

// ATM Types
export interface ATM {
    _id: string;
    name: string;
    slug: string;
    bankId: string;
    branchId?: string;
    bank?: Bank;
    branch?: Branch;
    address: string;
    location: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
    isActive: boolean;
    isWorking: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateATMData {
    name: string;
    bankId: string;
    branchId?: string;
    address: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    isWorking?: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
    data: T;
    message: string;
    status: string;
    option?: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    message: string;
    status: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
} 