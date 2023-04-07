import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  PermissionsGuard,
  Permissions,
} from 'src/auth/guards/permission.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['ROLE'], ['ROLE_READ']])
  @Get()
  getRoleList() {
    return this.rolesService.getRoleList();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['ROLE'], ['ROLE_READ']])
  @Get(':id')
  getRole(@Param('id') id: string) {
    return this.rolesService.getRole(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['ROLE'], ['ROLE_CREATE']])
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['ROLE'], ['ROLE_UPDATE']])
  @Patch(':id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['ROLE'], ['ROLE_DELETE']])
  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['ROLE'], ['ROLE_UPDATE']])
  @Put(':id/permissions')
  async assignPermissions(
    @Param('id') id: string,
    @Body() permissionIds: Array<string>,
  ) {
    return this.rolesService.assignPermissions(id, permissionIds);
  }
}
