import { PaginatedResponse, PaginationParams } from 'shared';

// Frontend utility functions for pagination

export interface PaginationState {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export class PaginationHelper {
  static buildQueryParams(state: PaginationState): URLSearchParams {
    const params = new URLSearchParams();

    if (state.page > 1) params.set('page', state.page.toString());
    if (state.limit !== 10) params.set('limit', state.limit.toString());
    if (state.sortBy) params.set('sortBy', state.sortBy);
    if (state.sortOrder && state.sortOrder !== 'asc')
      params.set('sortOrder', state.sortOrder);
    if (state.search) params.set('search', state.search);

    return params;
  }

  static parseResponse<T>(response: PaginatedResponse<T>) {
    return {
      data: response.data,
      pagination: response.pagination,
      hasNext: response.pagination.hasNext,
      hasPrev: response.pagination.hasPrev,
      totalPages: response.pagination.totalPages,
    };
  }

  static getPageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 5
  ): number[] {
    const pages: number[] = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}

// Example usage in a React component
export const usePagination = <T>(
  fetchFunction: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  initialState: PaginationState = { page: 1, limit: 10 }
) => {
  const [state, setState] = React.useState<PaginationState>(initialState);
  const [data, setData] = React.useState<T[]>([]);
  const [pagination, setPagination] = React.useState<
    PaginatedResponse<T>['pagination'] | null
  >(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = PaginationHelper.buildQueryParams(state);
      const response = await fetchFunction(Object.fromEntries(params));
      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [state, fetchFunction]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateState = (updates: Partial<PaginationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const goToPage = (page: number) => {
    updateState({ page });
  };

  const changeLimit = (limit: number) => {
    updateState({ page: 1, limit });
  };

  const setSorting = (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    updateState({ page: 1, sortBy, sortOrder });
  };

  const setSearch = (search: string) => {
    updateState({ page: 1, search });
  };

  return {
    data,
    pagination,
    loading,
    error,
    state,
    actions: {
      goToPage,
      changeLimit,
      setSorting,
      setSearch,
      refresh: fetchData,
    },
  };
};

// Import React for the hook example
import React from 'react';
