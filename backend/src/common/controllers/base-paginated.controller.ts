import { Query } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginationUtil } from '../utils/pagination.util';
import { PaginationOptions } from '../dto/pagination.dto';

export abstract class BasePaginatedController {
  /**
   * Get processed pagination options from query parameters
   */
  protected getPaginationOptions(
    @Query() paginationDto: PaginationDto
  ): PaginationOptions {
    return PaginationUtil.getPaginationOptions(paginationDto);
  }

  /**
   * Build Prisma query options for pagination
   * This is a convenience method that delegates to the the pagination utility
   */
  protected buildQueryOptions(
    options: PaginationOptions,
    where: any = {},
    include?: any,
    searchFields?: string[]
  ) {
    return PaginationUtil.buildQueryOptions(
      options,
      where,
      include,
      searchFields
    );
  }

  /**
   * Create a paginated response
   * This is a convenience method that delegates to the pagination utility
   */
  protected createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ) {
    return PaginationUtil.createPaginatedResponse(data, total, page, limit);
  }
}
