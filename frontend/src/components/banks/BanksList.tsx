import React, { useState, useEffect } from 'react';
import { bankApi } from '../../services/api';
import { Bank } from '../../types/api';

const BanksList: React.FC = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            setLoading(true);
            const response = await bankApi.getAllBanks();
            setBanks(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch banks');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBank = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this bank?')) {
            return;
        }

        try {
            await bankApi.deleteBank(id);
            // Refresh the list
            fetchBanks();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete bank');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Banks</h1>
                <button
                    onClick={() => {/* Navigate to create bank form */}}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add New Bank
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banks.map((bank) => (
                    <div
                        key={bank._id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {bank.name}
                            </h3>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    bank.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {bank.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        {bank.logo && (
                            <div className="mb-4">
                                <img
                                    src={bank.logo}
                                    alt={`${bank.name} logo`}
                                    className="h-16 w-auto object-contain"
                                />
                            </div>
                        )}

                        {bank.description && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {bank.description}
                            </p>
                        )}

                        <div className="space-y-2 text-sm text-gray-500">
                            {bank.website && (
                                <div>
                                    <span className="font-medium">Website:</span>{' '}
                                    <a
                                        href={bank.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        {bank.website}
                                    </a>
                                </div>
                            )}
                            {bank.contactNumber && (
                                <div>
                                    <span className="font-medium">Phone:</span>{' '}
                                    {bank.contactNumber}
                                </div>
                            )}
                            {bank.email && (
                                <div>
                                    <span className="font-medium">Email:</span>{' '}
                                    {bank.email}
                                </div>
                            )}
                            {bank.address && (
                                <div>
                                    <span className="font-medium">Address:</span>{' '}
                                    {bank.address}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => {/* Navigate to edit bank */}}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteBank(bank._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {banks.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No banks found.</p>
                </div>
            )}
        </div>
    );
};

export default BanksList; 