/**
 * Dashboard Component
 *
 * Main dashboard displaying KOLs and Angels with their stats
 */

import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { AccountCard } from './AccountCard';
import { AddAccountForm } from './AddAccountForm';

const REFRESH_INTERVAL = 30000; // 30 seconds

export function Dashboard() {
  const {
    accounts,
    loading,
    error,
    lastUpdated,
    addAccount,
    removeAccount,
    refreshAccounts,
  } = useAccounts();

  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh
  useAutoRefresh(refreshAccounts, REFRESH_INTERVAL, autoRefreshEnabled);

  // Manual refresh
  const handleManualRefresh = async () => {
    setRefreshing(true);
    await refreshAccounts();
    setRefreshing(false);
  };

  // Separate accounts by category
  const kols = accounts.filter((acc) => acc.category === 'kol');
  const angels = accounts.filter((acc) => acc.category === 'angel');

  // Format time since last update
  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return '';

    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KOL Tracker</h1>
              <p className="text-sm text-gray-500 mt-1">
                Tracking {accounts.length} accounts
              </p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Updated {getTimeSinceUpdate()}
                </span>
              )}
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {refreshing ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <span>⟳</span>
                    Refresh
                  </>
                )}
              </button>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={autoRefreshEnabled}
                  onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                  className="rounded"
                />
                Auto-refresh
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Add Account Form */}
        <div className="mb-8">
          <AddAccountForm onAdd={addAccount} />
        </div>

        {/* Account Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KOLs Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              KOLs
              <span className="text-sm font-normal text-gray-500">
                ({kols.length})
              </span>
            </h2>
            {kols.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                No KOLs tracked yet
              </div>
            ) : (
              <div className="space-y-4">
                {kols.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onRemove={removeAccount}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Angels Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              Angels
              <span className="text-sm font-normal text-gray-500">
                ({angels.length})
              </span>
            </h2>
            {angels.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                No Angels tracked yet
              </div>
            ) : (
              <div className="space-y-4">
                {angels.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onRemove={removeAccount}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
