import { useState, useEffect, createContext, useContext } from 'react';
import { authApi } from '../services/api';
import { User, LoginData, RegisterUserData } from '../types/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterUserData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const useAuthProvider = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (data: LoginData) => {
        try {
            const response = await authApi.login(data);
            const { token, user: userData } = response.data.data;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            
            // Set user in state
            setUser(userData);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (data: RegisterUserData) => {
        try {
            const response = await authApi.register(data);
            const userData = response.data.data;
            
            // Set user in state (registration might not return token)
            setUser(userData);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear token and user regardless of API call success
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await authApi.getLoggedInUserProfile();
            setUser(response.data.data);
        } catch (error) {
            console.error('Auth check error:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return {
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
    };
}; 