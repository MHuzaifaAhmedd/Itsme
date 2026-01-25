'use client';

import { useEffect, useState } from 'react';

interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
}

export default function BackendStatus() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setStatus(data);
        setError(null);
      } catch {
        setError('Backend server is not running');
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Checking backend connection...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400">
          ⚠️ {error}
        </p>
        <p className="text-xs text-red-500 dark:text-red-500 mt-1">
          Make sure the backend server is running on port 4000
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-green-300 rounded-lg bg-green-50 dark:bg-green-900/20">
      <p className="text-sm text-green-700 dark:text-green-400">
        ✅ {status?.message || 'Backend connected successfully!'}
      </p>
      {status?.timestamp && (
        <p className="text-xs text-green-600 dark:text-green-500 mt-1">
          Last checked: {new Date(status.timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
