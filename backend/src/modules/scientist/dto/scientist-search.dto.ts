import { IsString, IsNotEmpty } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ScientistSearchDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  keywords: string;
}
