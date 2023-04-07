import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Put,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  PermissionsGuard,
  Permissions,
} from 'src/auth/guards/permission.guard';

export const CheckPolicies = (handlers: Array<string>) =>
  SetMetadata('permissions', handlers);

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['USER'], ['USER_READ']])
  @Get()
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<{ items: User[]; total: number }> {
    return this.usersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['USER'], ['USER_READ']])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.find(id);
  }

  @Post()
  async signup(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['USER'], ['USER_UPDATE']])
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['USER'], ['USER_DELETE']])
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['USER'], ['USER_UPDATE']])
  @Put(':id/roles')
  async assignRoles(@Param('id') id: string, @Body() roleIds: Array<string>) {
    return this.usersService.assignRoles(id, roleIds);
  }
}
