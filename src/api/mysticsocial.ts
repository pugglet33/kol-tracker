/**
 * MysticSocial API Client
 *
 * Fetches real user engagement data and leaderboard stats from mysticsocial.xyz
 * Uses a proxy to avoid CORS issues
 */

export interface MysticSocialUser {
  authorId: string;
  authorName: string;
  profileImageUrl?: string;
  rank: number;
  totalPosts: number;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  bookmarks: number;
  views: number;
  baseMana: number;
  bonusMana: number;
  totalMana: number;
  latestPostDate: string;
  isVerified?: boolean;
  referralCount?: number;
}

export interface MysticSocialResponse {
  success: boolean;
  data: {
    authors: MysticSocialUser[];
    totalCount: number;
    hasMore: boolean;
  };
  type: 'weekly' | 'all-time';
  weekly: boolean;
}

export interface Post {
  tweetId: string;
  authorId: string;
  authorName: string;
  text: string;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  bookmarks: number;
  views: number;
  createdAt: string;
  profileImageUrl?: string;
}

export interface PostsResponse {
  success: boolean;
  data: Post[];
  count: number;
  type: 'weekly' | 'all-time';
  weekly: boolean;
  search: string;
}

export class MysticSocialAPI {
  private baseURL: string;
  private timeout: number;
  private useProxy: boolean;

  constructor(baseURL: string = 'https://mysticsocial.xyz', timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    // Use proxy in production to avoid CORS issues
    this.useProxy = window.location.hostname !== 'localhost';
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
   * Get mana leaderboard data
   */
  async getManaLeaderboard(
    page: number = 1,
    limit: number = 50,
    searchTerm: string = '',
    weekly: boolean = false
  ): Promise<MysticSocialResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(searchTerm && { search: searchTerm }),
      ...(weekly && { weekly: 'true' }),
    });

    // Use proxy in production to avoid CORS issues
    const endpoint = this.useProxy
      ? `/api/mystic-proxy?${params}`
      : `/api/mana?${params}`;

    const url = this.useProxy
      ? endpoint  // Proxy is relative to current domain
      : `${this.baseURL}${endpoint}`;

    return this.request<MysticSocialResponse>(url);
  }

  /**
   * Find a specific user by their Twitter handle
   */
  async findUserByHandle(handle: string): Promise<MysticSocialUser | null> {
    try {
      // Remove @ symbol if present
      const cleanHandle = handle.replace(/^@/, '');

      // Search for the user in the leaderboard
      const response = await this.getManaLeaderboard(1, 100, cleanHandle);

      if (!response.success || !response.data.authors.length) {
        return null;
      }

      // Find exact match (case insensitive)
      const user = response.data.authors.find(
        author => author.authorName.toLowerCase() === cleanHandle.toLowerCase()
      );

      return user || null;
    } catch (error) {
      console.error('Error finding user by handle:', error);
      return null;
    }
  }

  /**
   * Get user stats by Twitter handle
   */
  async getUserStats(handle: string): Promise<MysticSocialUser | null> {
    try {
      const user = await this.findUserByHandle(handle);
      return user;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  /**
   * Get top posts
   */
  async getTopPosts(
    limit: number = 10,
    weekly: boolean = false,
    searchTerm: string = ''
  ): Promise<PostsResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(weekly && { weekly: 'true' }),
      ...(searchTerm && { search: searchTerm }),
    });

    return this.request<PostsResponse>(`/api/posts?${params}`);
  }

  /**
   * Get posts by a specific author
   */
  async getPostsByAuthor(authorName: string, limit: number = 50): Promise<Post[]> {
    try {
      const response = await this.getTopPosts(limit, false, authorName);
      if (response.success && response.data) {
        // Filter to exact author matches
        return response.data.filter(
          post => post.authorName.toLowerCase() === authorName.toLowerCase()
        );
      }
      return [];
    } catch (error) {
      console.error('Error fetching posts by author:', error);
      return [];
    }
  }
}

// Create singleton instance
const mysticSocialAPI = new MysticSocialAPI();

export default mysticSocialAPI;

// Utility functions
export const formatManaScore = (mana: number): string => {
  return mana.toLocaleString();
};

export const formatEngagementNumber = (num: number): string => {
  return num.toLocaleString();
};
