import { IsOptional, IsArray, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ScientistSearchDto extends PaginationDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  affiliations?: string[];
}
