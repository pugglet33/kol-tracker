/**
 * AddAccountForm Component
 *
 * Form for adding new accounts to track
 */

import { useState } from 'react';
import type { AccountCategory } from '../types/account';

interface AddAccountFormProps {
  onAdd: (username: string, category: AccountCategory) => Promise<{ success: boolean; error?: string }>;
}

export function AddAccountForm({ onAdd }: AddAccountFormProps) {
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState<AccountCategory>('kol');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await onAdd(username.trim(), category);

    if (result.success) {
      setSuccess(true);
      setUsername('');
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to add account');
    }

    setLoading(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Account</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Twitter Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., elonmusk"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="kol"
                checked={category === 'kol'}
                onChange={(e) => setCategory(e.target.value as AccountCategory)}
                className="mr-2"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">KOL</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="angel"
                checked={category === 'angel'}
                onChange={(e) => setCategory(e.target.value as AccountCategory)}
                className="mr-2"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">Angel</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
            Account added successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding...' : 'Add Account'}
        </button>
      </form>
    </div>
  );
}
