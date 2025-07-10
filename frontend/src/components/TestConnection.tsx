import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing connection...');
        const response = await api.get('/test');
        setData(response.data);
        setStatus('Connection successful!');
        setError('');
      } catch (err: any) {
        setError(err.message || 'Connection failed');
        setStatus('Connection failed');
        console.error('Connection test error:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Status: <span className={`font-semibold ${status.includes('successful') ? 'text-green-600' : status.includes('failed') ? 'text-red-600' : 'text-blue-600'}`}>{status}</span></p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <strong>Response:</strong>
          <pre className="mt-2 text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestConnection; 