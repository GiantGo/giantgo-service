import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}
