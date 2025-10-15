import React, { useState } from 'react';
import { PaginatedResponse, PaginationParams } from 'shared';
import { PaginationControls } from '../common/PaginationControls';

// Example component showing how to use the pagination system
interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface UsersListExampleProps {
  // This would typically come from your API service
  fetchUsers: (params: PaginationParams) => Promise<PaginatedResponse<User>>;
}

export const UsersListExample: React.FC<UsersListExampleProps> = ({
  fetchUsers,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedResponse<User>['pagination'] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const loadUsers = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      const params: PaginationParams = {
        page,
        limit,
        ...(search && { search }),
        ...(sortBy && { sortBy, sortOrder }),
      };

      const response = await fetchUsers(params);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (pagination) {
      loadUsers(page, pagination.limit);
    }
  };

  const handleLimitChange = (limit: number) => {
    loadUsers(1, limit);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(1, pagination?.limit || 10);
  };

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    loadUsers(1, pagination?.limit || 10);
  };

  // Load initial data
  React.useEffect(() => {
    loadUsers();
  }, []);

  if (error) {
    return (
      <div className='rounded-md bg-red-50 p-4'>
        <div className='text-sm text-red-700'>{error}</div>
        <button
          onClick={() => loadUsers()}
          className='mt-2 text-sm text-red-600 hover:text-red-500'
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Search and Filters */}
      <div className='bg-white p-4 rounded-lg shadow'>
        <form onSubmit={handleSearch} className='flex gap-4 items-end'>
          <div className='flex-1'>
            <label
              htmlFor='search'
              className='block text-sm font-medium text-gray-700'
            >
              Search
            </label>
            <input
              type='text'
              id='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search by email, username, or name...'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className='bg-white shadow overflow-hidden sm:rounded-md'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>Users</h3>
          <p className='mt-1 max-w-2xl text-sm text-gray-500'>
            Manage and view all users in the system
          </p>
        </div>

        {loading ? (
          <div className='px-4 py-8 text-center'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
            <p className='mt-2 text-sm text-gray-500'>Loading users...</p>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                      onClick={() => handleSort('email')}
                    >
                      Email
                      {sortBy === 'email' && (
                        <span className='ml-1'>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                      onClick={() => handleSort('username')}
                    >
                      Username
                      {sortBy === 'username' && (
                        <span className='ml-1'>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                      onClick={() => handleSort('firstName')}
                    >
                      Name
                      {sortBy === 'firstName' && (
                        <span className='ml-1'>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th scope='col' className='relative px-6 py-3'>
                      <span className='sr-only'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.map((user) => (
                    <tr key={user.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {user.email}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {user.username}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.firstName || user.lastName || '-'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <button className='text-indigo-600 hover:text-indigo-900'>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && !loading && (
              <div className='px-4 py-8 text-center'>
                <p className='text-sm text-gray-500'>No users found</p>
              </div>
            )}
          </>
        )}

        {/* Pagination Controls */}
        {pagination && (
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};
