import { ApiResponse, Scientist, City, SearchFilters } from '@shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Scientist endpoints
  async getScientists(filters?: SearchFilters): Promise<Scientist[]> {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.specialization) {
      filters.specialization.forEach((spec) =>
        params.append('specialization', spec)
      );
    }

    const response = await this.request<Scientist[]>(
      `/scientists?${params.toString()}`
    );
    return response.data!;
  }

  async getScientist(id: string): Promise<Scientist> {
    const response = await this.request<Scientist>(`/scientists/${id}`);
    return response.data!;
  }

  async searchScientists(
    query: string,
    filters?: SearchFilters
  ): Promise<Scientist[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.specialization) {
      filters.specialization.forEach((spec) =>
        params.append('specialization', spec)
      );
    }

    const response = await this.request<Scientist[]>(
      `/scientists/search?${params.toString()}`
    );
    return response.data!;
  }

  // City endpoints
  async getCities(): Promise<City[]> {
    const response = await this.request<City[]>('/cities');
    return response.data!;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
