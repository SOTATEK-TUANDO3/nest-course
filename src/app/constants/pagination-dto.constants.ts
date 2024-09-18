import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { constants } from './common.constant';

export class PaginationDtoConstants {
  @ApiPropertyOptional({ default: constants.PAGINATION.LIMIT_DEFAULT })
  @IsNumber()
  @Min(0)
  @Max(1000)
  @IsOptional()
  @Type(() => Number)
  limit: number = constants.PAGINATION.LIMIT_DEFAULT;

  @ApiPropertyOptional({ default: constants.PAGINATION.PAGE_DEFAULT })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page: number = constants.PAGINATION.PAGE_DEFAULT;
}
