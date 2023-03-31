import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly current: number;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly size: number;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly keyword: string;
}
