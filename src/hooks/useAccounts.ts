/**
 * Custom hook for managing tracked accounts
 */

import { useState, useEffect, useCallback } from 'react';
import backendAPI from '../api/backend';
import mysticSocialAPI from '../api/mysticsocial';
import type { AccountWithStats, AccountCategory } from '../types/account';

export function useAccounts() {
  const [accounts, setAccounts] = useState<AccountWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Fetch accounts from backend and enrich with stats from MysticSocial
   */
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get tracked accounts from backend
      const trackedAccounts = await backendAPI.getAccounts();

      // Enrich each account with stats from MysticSocial
      const enrichedAccounts = await Promise.all(
        trackedAccounts.map(async (account) => {
          try {
            const stats = await mysticSocialAPI.getUserStats(account.username);

            if (!stats) {
              return {
                ...account,
                totalTweets: 0,
                totalMana: 0,
                rank: 0,
                error: 'No tracked tweets found',
              };
            }

            return {
              ...account,
              totalTweets: stats.totalPosts,
              totalMana: stats.totalMana,
              rank: stats.rank,
              lastFetched: new Date().toISOString(),
            };
          } catch (err) {
            console.error(`Error fetching stats for ${account.username}:`, err);
            return {
              ...account,
              totalTweets: 0,
              totalMana: 0,
              rank: 0,
              error: 'Failed to fetch stats',
            };
          }
        })
      );

      setAccounts(enrichedAccounts);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a new account to track
   */
  const addAccount = useCallback(async (username: string, category: AccountCategory) => {
    try {
      setError(null);

      // First, verify the account exists in MysticSocial
      const stats = await mysticSocialAPI.getUserStats(username);

      if (!stats) {
        throw new Error(`No tracked tweets found for @${username}`);
      }

      // Add to backend
      await backendAPI.addAccount(username, category);

      // Refresh accounts
      await fetchAccounts();

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add account';
      setError(message);
      return { success: false, error: message };
    }
  }, [fetchAccounts]);

  /**
   * Remove an account from tracking
   */
  const removeAccount = useCallback(async (accountId: string) => {
    try {
      setError(null);
      await backendAPI.removeAccount(accountId);
      await fetchAccounts();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove account';
      setError(message);
      return { success: false, error: message };
    }
  }, [fetchAccounts]);

  /**
   * Refresh account stats
   */
  const refreshAccounts = useCallback(() => {
    return fetchAccounts();
  }, [fetchAccounts]);

  // Initial load
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    lastUpdated,
    addAccount,
    removeAccount,
    refreshAccounts,
  };
}
