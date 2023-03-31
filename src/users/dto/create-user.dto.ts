import {
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsMobilePhone,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMobilePhone('zh-CN', {}, { message: '手机格式不正确' })
  readonly mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
