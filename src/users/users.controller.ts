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
import { User, Prisma } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('current') current: string,
    @Query('size') size: string,
    @Query('keyword') keyword: string,
  ): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { mobile: { contains: keyword } },
        { email: { contains: keyword } },
      ];
    }

    return this.usersService.users({
      current: parseInt(current) ?? 0,
      size: parseInt(size) ?? 10,
      where,
    });
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<User | null> {
    return this.usersService.user({ id });
  }

  @Post()
  async signup(
    @Body()
    userData: Prisma.UserCreateInput,
  ): Promise<User> {
    return this.usersService.createUser(userData);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    userData: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.usersService.updateUser({
      where: {
        id,
      },
      data: userData,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser({
      id,
    });
  }
}
