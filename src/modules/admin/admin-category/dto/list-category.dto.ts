import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDtoConstants } from 'src/app/constants/pagination-dto.constants';

export class ListCategoryDto extends PartialType(PaginationDtoConstants) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q: string;
}
