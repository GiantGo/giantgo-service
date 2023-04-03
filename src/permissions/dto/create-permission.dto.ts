import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty()
  @IsNotEmpty({ message: '名称不能为空' })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '编码不能为空' })
  readonly slug: string;

  @ApiProperty()
  @IsOptional()
  readonly parentId: string;
}
