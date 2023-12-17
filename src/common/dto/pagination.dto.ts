import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    description: 'The number of items to return',
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Reemplaza enablesImplicitConversion: true
  limit?: number;

  @ApiProperty({
    example: 0,
    description:
      'The number of items to skip before starting to collect the result set',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
