import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  readonly name: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly email: string;

  @IsOptional()
  @IsMobilePhone('zh-CN', {}, { message: '手机格式不正确' })
  readonly mobile: string;
}
