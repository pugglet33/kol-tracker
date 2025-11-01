/**
 * Backend API Client for account management
 */

import { BACKEND_URL } from '../config';
import type { TrackedAccount, AccountCategory } from '../types/account';

export interface AddAccountRequest {
  username: string;
  category: AccountCategory;
}

export interface AccountsResponse {
  success: boolean;
  accounts: TrackedAccount[];
}

export class BackendAPI {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = BACKEND_URL, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Get all tracked accounts
   */
  async getAccounts(): Promise<TrackedAccount[]> {
    const response = await this.request<AccountsResponse>('/api/accounts');
    return response.accounts;
  }

  /**
   * Add a new account to track
   */
  async addAccount(username: string, category: AccountCategory): Promise<TrackedAccount> {
    const response = await this.request<{ success: boolean; account: TrackedAccount }>(
      '/api/accounts',
      {
        method: 'POST',
        body: JSON.stringify({ username, category }),
      }
    );
    return response.account;
  }

  /**
   * Remove an account from tracking
   */
  async removeAccount(accountId: string): Promise<void> {
    await this.request(`/api/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }
}

// Create singleton instance
const backendAPI = new BackendAPI();

export default backendAPI;
