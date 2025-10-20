import { Controller, Get, Query } from '@nestjs/common';
import { ScientistService } from './scientist.service';
import { ScientistSearchDto } from './dto/scientist-search.dto';
import { BasePaginatedController } from '../../common/controllers/base-paginated.controller';
import { PaginatedResponse } from 'shared';
import { ScientistSearchResult } from './types/pubmed.types';

@Controller('scientists')
export class ScientistController extends BasePaginatedController {
  constructor(private readonly scientistService: ScientistService) {
    super();
  }

  /**
   * Search scientists by keywords
   * GET /scientists/search?keywords=Boston&page=1&limit=20
   */
  @Get('search')
  async searchScientists(
    @Query() searchDto: ScientistSearchDto
  ): Promise<PaginatedResponse<ScientistSearchResult>> {
    const options = this.getPaginationOptions(searchDto);
    return await this.scientistService.searchScientists(
      searchDto.keywords,
      options
    );
  }
}
