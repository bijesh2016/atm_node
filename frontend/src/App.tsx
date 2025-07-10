import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { bankApi, branchApi, atmApi, rootApi } from './services/api';
import Login from './components/auth/Login';
import BanksList from './components/banks/BanksList';
import ATMsList from './components/atms/ATMsList';
import TestConnection from './components/TestConnection';
import { Bank, Branch, ATM } from './types/api';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        banks: 0,
        branches: 0,
        atms: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [banksRes, branchesRes, atmsRes] = await Promise.all([
                bankApi.getAllBanks(),
                branchApi.getAllBranches(),
                atmApi.getAllATMs()
            ]);

            setStats({
                banks: banksRes.data.data.length,
                branches: branchesRes.data.data.length,
                atms: atmsRes.data.data.length
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Banking System Dashboard
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                Welcome, {user?.name}!
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold">B</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Banks</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.banks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold">Br</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Branches</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.branches}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold">A</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total ATMs</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.atms}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => {/* Navigate to banks */}}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Manage Banks
                        </button>
                        <button
                            onClick={() => {/* Navigate to branches */}}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            Manage Branches
                        </button>
                        <button
                            onClick={() => {/* Navigate to ATMs */}}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                        >
                            Manage ATMs
                        </button>
                    </div>
                </div>

                {/* Recent Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Banks</h2>
                        <BanksList />
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent ATMs</h2>
                        <ATMsList />
                    </div>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Temporarily show test connection for CORS verification
    return <TestConnection />;
    
    // Uncomment this line when you want to go back to normal app flow:
    // return user ? <Dashboard /> : <Login />;
};

const AppWrapper: React.FC = () => {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
};

export default AppWrapper; 