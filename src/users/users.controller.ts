import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<{ items: User[]; total: number }> {
    return this.usersService.findAll();
  }

  @Post()
  async signup(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(parseInt(id));
  }
}
