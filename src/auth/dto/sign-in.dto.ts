import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}
