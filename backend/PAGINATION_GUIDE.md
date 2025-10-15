# Pagination Guide - Type-Safe Utility Approach

This guide explains how to use the refactored pagination system that maintains full type safety by using Prisma directly with utility functions instead of services.

## Key Benefits

- ✅ **Full Type Safety**: Direct Prisma calls maintain all TypeScript types
- ✅ **No Model Passing**: No need to pass Prisma models to external services
- ✅ **Utility-Based**: Static utility functions for better performance and simplicity
- ✅ **Flexible**: Easy to customize queries with complex where clauses, includes, etc.
- ✅ **Reusable**: Utility functions help format common pagination patterns

## Architecture

The pagination system consists of:

1. **PaginationUtil**: Static utility class with all pagination helper methods
2. **BasePaginatedController**: Abstract controller with convenience methods
3. **Pagination Decorator**: Automatically processes query parameters

## Basic Usage

### 1. In a Service (Recommended Approach)

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationUtil } from '../common/utils/pagination.util';
import { PaginationOptions } from '../common/dto/pagination.dto';
import { PaginatedResponse } from 'shared';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAllPaginated(
    options: PaginationOptions
  ): Promise<PaginatedResponse<User>> {
    // Build query options using the pagination utility
    const queryOptions = PaginationUtil.buildQueryOptions(
      options,
      {}, // where clause
      undefined, // include relations
      ['email', 'username', 'firstName', 'lastName'] // search fields
    );

    // Execute Prisma queries directly with full type safety
    const [data, total] = await Promise.all([
      this.prisma.user.findMany(queryOptions),
      this.prisma.user.count({ where: queryOptions.where }),
    ]);

    // Create paginated response
    return PaginationUtil.createPaginatedResponse(
      data,
      total,
      options.page,
      options.limit
    );
  }
}
```

### 2. In a Controller

```typescript
import { Controller, Get } from '@nestjs/common';
import { Pagination } from '../common/decorators/pagination.decorator';
import { PaginationOptions } from '../common/dto/pagination.dto';
import { PaginatedResponse } from 'shared';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(
    @Pagination() options: PaginationOptions
  ): Promise<PaginatedResponse<User>> {
    return this.userService.findAllPaginated(options);
  }
}
```

## Advanced Usage

### Complex Where Clauses

```typescript
  async findUsersWithFilters(
    options: PaginationOptions,
    filters: {
      role?: string;
      isActive?: boolean;
      createdAfter?: Date;
    }
  ): Promise<PaginatedResponse<User>> {
    // Build custom where clause
    const whereClause = {
      ...(filters.role && { role: filters.role }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.createdAfter && {
        createdAt: { gte: filters.createdAfter }
      }),
    };

    const queryOptions = PaginationUtil.buildQueryOptions(
      options,
      whereClause,
      undefined,
      ['email', 'username']
    );

    const [data, total] = await Promise.all([
      this.prisma.user.findMany(queryOptions),
      this.prisma.user.count({ where: queryOptions.where }),
    ]);

    return PaginationUtil.createPaginatedResponse(
      data,
      total,
      options.page,
      options.limit
    );
  }
```

### With Relations

```typescript
  async findUsersWithPosts(
    options: PaginationOptions
  ): Promise<PaginatedResponse<User & { posts: Post[] }>> {
    const queryOptions = PaginationUtil.buildQueryOptions(
      options,
      {}, // where clause
      {
        posts: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
      ['email', 'username']
    );

    const [data, total] = await Promise.all([
      this.prisma.user.findMany(queryOptions),
      this.prisma.user.count({ where: queryOptions.where }),
    ]);

    return PaginationUtil.createPaginatedResponse(
      data,
      total,
      options.page,
      options.limit
    );
  }
```

### Using Base Controller

```typescript
import { BasePaginatedController } from '../common/controllers/base-paginated.controller';

@Controller('users')
export class UserController extends BasePaginatedController {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {
    super();
  }

  @Get()
  async findAll(
    @Pagination() options: PaginationOptions
  ): Promise<PaginatedResponse<User>> {
    // Use convenience methods from base controller
    const queryOptions = this.buildQueryOptions(options, {}, undefined, [
      'email',
      'username',
    ]);

    const [data, total] = await Promise.all([
      this.prisma.user.findMany(queryOptions),
      this.prisma.user.count({ where: queryOptions.where }),
    ]);

    return this.createPaginatedResponse(
      data,
      total,
      options.page,
      options.limit
    );
  }
}
```

## Utility Functions

### PaginationUtil

```typescript
import { PaginationUtil } from '../common/utils/pagination.util';

// Combine multiple where clauses
const combinedWhere = PaginationUtil.combineWhereClauses(
  { isActive: true },
  { role: 'admin' },
  PaginationUtil.buildPrismaWhere('john', ['firstName', 'lastName'])
);

// Date range filtering
const dateFilter = PaginationUtil.buildDateRangeFilter(
  'createdAt',
  new Date('2024-01-01'),
  new Date('2024-12-31')
);

// Numeric range filtering
const ageFilter = PaginationUtil.buildNumericRangeFilter('age', 18, 65);
```

## Query Parameters

The pagination system supports these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by (default: 'createdAt')
- `sortOrder`: Sort direction - 'asc' or 'desc' (default: 'desc')
- `search`: Search term for text fields

### Example Request

```
GET /users?page=2&limit=20&sortBy=email&sortOrder=asc&search=john
```

## Response Format

```typescript
{
  "data": [
    // Array of your entities
  ],
  "pagination": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Migration from Old Approach

### Before (Type-Unsafe)

```typescript
// OLD - Don't do this anymore
const result = await this.paginationService.paginate(
  this.prisma.user, // ❌ Passing model kills type safety
  options,
  where,
  include,
  searchFields
);
```

### After (Type-Safe Utility Approach)

```typescript
// NEW - Recommended approach
const queryOptions = PaginationUtil.buildQueryOptions(
  options,
  where,
  include,
  searchFields
);

const [data, total] = await Promise.all([
  this.prisma.user.findMany(queryOptions), // ✅ Direct Prisma call with full types
  this.prisma.user.count({ where: queryOptions.where }),
]);

return PaginationUtil.createPaginatedResponse(
  data,
  total,
  options.page,
  options.limit
);
```

## Best Practices

1. **Always use direct Prisma calls** - Never pass models to external services
2. **Use the pagination utility functions** - For building query options and responses
3. **Leverage TypeScript types** - Let Prisma's generated types guide your development
4. **Use the decorator** - `@Pagination()` automatically processes query parameters
5. **Extend BasePaginatedController** - For convenience methods when needed
6. **Combine utilities** - Use `PaginationUtil` functions for complex filtering

## Examples

See the following files for complete examples:

- `src/common/examples/pagination-example.controller.ts` - Controller examples
- `src/modules/user/user.service.ts` - Service implementation
- `src/modules/user/user.controller.ts` - Controller implementation
