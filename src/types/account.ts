export type AccountCategory = 'kol' | 'angel';

export interface TrackedAccount {
  id: string;
  username: string;
  category: AccountCategory;
  addedAt: string;
}

export interface AccountWithStats extends TrackedAccount {
  totalTweets: number;
  totalMana: number;
  rank: number;
  lastFetched?: string;
  error?: string;
}
