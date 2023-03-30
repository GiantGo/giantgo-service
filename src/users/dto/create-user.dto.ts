import {
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsMobilePhone,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  readonly name: string;

  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly email: string;

  @IsNotEmpty()
  @IsMobilePhone('zh-CN', {}, { message: '手机格式不正确' })
  readonly mobile: string;

  @IsNotEmpty()
  readonly password: string;
}
