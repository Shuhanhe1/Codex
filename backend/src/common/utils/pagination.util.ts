import { PaginationMeta, PaginatedResponse } from 'shared';
import { PaginationOptions } from '../dto/pagination.dto';

export class PaginationUtil {
  static createPaginationMeta(
    total: number,
    page: number,
    limit: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    return {
      data,
      pagination: this.createPaginationMeta(total, page, limit),
    };
  }

  static getPaginationOptions(paginationDto: any): PaginationOptions {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;

    return {
      page,
      limit,
      skip,
      sortBy: paginationDto.sortBy,
      sortOrder: paginationDto.sortOrder || 'asc',
      search: paginationDto.search,
    };
  }

  static buildPrismaOrderBy(
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    if (!sortBy) {
      return { createdAt: 'desc' }; // Default sorting
    }

    return {
      [sortBy]: sortOrder,
    };
  }

  static buildPrismaWhere(search?: string, searchFields?: string[]) {
    if (!search || !searchFields || searchFields.length === 0) {
      return {};
    }

    return {
      OR: searchFields.map((field) => ({
        [field]: {
          contains: search,
          mode: 'insensitive' as const,
        },
      })),
    };
  }

  /**
   * Combines multiple where clauses into a single Prisma where clause
   * Useful when you have base filters plus search filters
   */
  static combineWhereClauses(...whereClauses: any[]) {
    return whereClauses.reduce((acc, where) => {
      if (!where || Object.keys(where).length === 0) {
        return acc;
      }
      return { ...acc, ...where };
    }, {});
  }

  /**
   * Builds a date range filter for Prisma
   * Useful for filtering by creation date, update date, etc.
   */
  static buildDateRangeFilter(field: string, startDate?: Date, endDate?: Date) {
    const filter: any = {};

    if (startDate || endDate) {
      filter[field] = {};
      if (startDate) {
        filter[field].gte = startDate;
      }
      if (endDate) {
        filter[field].lte = endDate;
      }
    }

    return filter;
  }

  /**
   * Builds a numeric range filter for Prisma
   * Useful for filtering by age, price, etc.
   */
  static buildNumericRangeFilter(field: string, min?: number, max?: number) {
    const filter: any = {};

    if (min !== undefined || max !== undefined) {
      filter[field] = {};
      if (min !== undefined) {
        filter[field].gte = min;
      }
      if (max !== undefined) {
        filter[field].lte = max;
      }
    }

    return filter;
  }

  /**
   * Builds Prisma query options for pagination
   * Use this to get properly formatted options for your Prisma queries
   */
  static buildQueryOptions(
    options: PaginationOptions,
    where: any = {},
    include?: any,
    searchFields?: string[]
  ) {
    const { skip, limit, sortBy, sortOrder, search } = options;

    // Build where clause with search
    const whereClause = {
      ...where,
      ...this.buildPrismaWhere(search, searchFields),
    };

    // Build order by clause
    const orderBy = this.buildPrismaOrderBy(sortBy, sortOrder);

    return {
      where: whereClause,
      skip,
      take: limit,
      orderBy,
      include,
    };
  }
}
