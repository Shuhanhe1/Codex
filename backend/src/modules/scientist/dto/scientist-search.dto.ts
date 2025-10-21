import { IsString, IsOptional, IsArray, IsStringArray } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ScientistSearchDto extends PaginationDto {
  @IsString()
  @IsOptional()
  keywords?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywordsArray?: string[];

  @IsString()
  @IsOptional()
  affiliation?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  affiliationArray?: string[];
}
