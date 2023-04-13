import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const slugRegex =
  /^[a-zA-Z0-9]+(\_[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(\_[a-zA-Z0-9]+)*)*$/;
export class CreatePermissionDto {
  @ApiProperty()
  @IsNotEmpty({ message: '名称不能为空' })
  readonly name: string;

  @ApiProperty()
  @Matches(slugRegex, { message: '编码格式不正确' })
  @IsNotEmpty({ message: '编码不能为空' })
  readonly slug: string;

  @ApiProperty()
  @IsOptional()
  readonly parentId: string;
}
