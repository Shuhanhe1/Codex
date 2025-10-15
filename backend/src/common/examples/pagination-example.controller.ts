import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';
import { Pagination } from '../decorators/pagination.decorator';
import { PaginationOptions } from '../dto/pagination.dto';
import { PaginatedResponse } from 'shared';
import { PaginationUtil } from '../utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';

// Example controller showing how to use pagination with direct Prisma calls

@Controller('example')
export class PaginationExampleController {
  constructor(private prisma: PrismaService) {}

  // Method 1: Using the decorator with direct Prisma calls (recommended)
  @Get('with-decorator')
  async findAllWithDecorator(
    @Pagination() options: PaginationOptions
  ): Promise<PaginatedResponse<any>> {
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

  // Method 2: Using the DTO with manual processing
  @Get('with-dto')
  async findAllWithDto(
    @Query() paginationDto: PaginationDto
  ): Promise<PaginatedResponse<any>> {
    // Process the DTO manually
    const options = PaginationUtil.getPaginationOptions(paginationDto);

    // Build query options
    const queryOptions = PaginationUtil.buildQueryOptions(
      options,
      { email: { contains: '@example.com' } }, // custom where clause
      undefined,
      ['username'] // search only in username
    );

    // Execute Prisma queries
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

  // Method 3: Complex example with relations and custom filtering
  @Get('with-relations')
  async findAllWithRelations(
    @Pagination() options: PaginationOptions
  ): Promise<PaginatedResponse<any>> {
    // Example of more complex query options
    const queryOptions = PaginationUtil.buildQueryOptions(
      options,
      {
        // Custom where conditions
        createdAt: {
          gte: new Date('2024-01-01'), // Only users created after 2024
        },
      },
      {
        // Include relations (if you had any)
        // posts: true,
        // comments: true,
      },
      ['email', 'username', 'firstName', 'lastName'] // search fields
    );

    // Execute with full type safety
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
}
