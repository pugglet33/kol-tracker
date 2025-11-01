/**
 * AccountCard Component
 *
 * Displays a single tracked account with its stats
 */

import type { AccountWithStats } from '../types/account';

interface AccountCardProps {
  account: AccountWithStats;
  onRemove: (id: string) => void;
}

export function AccountCard({ account, onRemove }: AccountCardProps) {
  const hasError = !!account.error;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            @{account.username}
          </h3>
          {account.rank > 0 && (
            <span className="text-sm text-gray-500">Rank #{account.rank}</span>
          )}
        </div>
        <button
          onClick={() => onRemove(account.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
          title="Remove account"
        >
          Remove
        </button>
      </div>

      {hasError ? (
        <div className="text-red-600 text-sm">
          {account.error}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Tracked Tweets:</span>
            <span className="font-semibold text-gray-900">
              {account.totalTweets.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Total Mana:</span>
            <span className="font-semibold text-indigo-600">
              {account.totalMana.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Added: {new Date(account.addedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
