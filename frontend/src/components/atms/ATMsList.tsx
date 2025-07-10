import React, { useState, useEffect } from 'react';
import { atmApi } from '../../services/api';
import { ATM } from '../../types/api';

const ATMsList: React.FC = () => {
    const [atms, setAtms] = useState<ATM[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchATMs();
    }, []);

    const fetchATMs = async () => {
        try {
            setLoading(true);
            const response = await atmApi.getAllATMs();
            setAtms(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch ATMs');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteATM = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this ATM?')) {
            return;
        }

        try {
            await atmApi.deleteATM(id);
            // Refresh the list
            fetchATMs();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete ATM');
        }
    };

    const getStatusColor = (isWorking: boolean, isActive: boolean) => {
        if (!isActive) return 'bg-gray-100 text-gray-800';
        if (isWorking) return 'bg-green-100 text-green-800';
        return 'bg-red-100 text-red-800';
    };

    const getStatusText = (isWorking: boolean, isActive: boolean) => {
        if (!isActive) return 'Inactive';
        if (isWorking) return 'Working';
        return 'Out of Service';
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
                <h1 className="text-3xl font-bold text-gray-900">ATMs</h1>
                <button
                    onClick={() => {/* Navigate to create ATM form */}}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add New ATM
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {atms.map((atm) => (
                    <div
                        key={atm._id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {atm.name}
                            </h3>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                    atm.isWorking,
                                    atm.isActive
                                )}`}
                            >
                                {getStatusText(atm.isWorking, atm.isActive)}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <span className="font-medium text-gray-700">Bank:</span>{' '}
                                <span className="text-gray-600">
                                    {atm.bank?.name || 'Unknown Bank'}
                                </span>
                            </div>

                            {atm.branch && (
                                <div>
                                    <span className="font-medium text-gray-700">Branch:</span>{' '}
                                    <span className="text-gray-600">{atm.branch.name}</span>
                                </div>
                            )}

                            <div>
                                <span className="font-medium text-gray-700">Address:</span>{' '}
                                <span className="text-gray-600">{atm.address}</span>
                            </div>

                            {atm.location && (
                                <div>
                                    <span className="font-medium text-gray-700">Location:</span>{' '}
                                    <span className="text-gray-600">
                                        {atm.location.coordinates[1].toFixed(6)}, {atm.location.coordinates[0].toFixed(6)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => {/* Navigate to edit ATM */}}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteATM(atm._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {atms.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No ATMs found.</p>
                </div>
            )}
        </div>
    );
};

export default ATMsList; 