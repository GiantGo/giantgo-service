import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMobilePhone('zh-CN', {}, { message: '手机格式不正确' })
  readonly mobile: string;
}
