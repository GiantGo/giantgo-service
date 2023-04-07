import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  PermissionsGuard,
  Permissions,
} from 'src/auth/guards/permission.guard';

@ApiBearerAuth()
@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['PERMISSION'], ['PERMISSION_READ']])
  @Get('tree')
  getPermissionTree() {
    return this.permissionsService.getPermissionTree();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['PERMISSION'], ['PERMISSION_READ']])
  @Get()
  getPermissionList() {
    return this.permissionsService.getPermissionList();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['PERMISSION'], ['PERMISSION_READ']])
  @Get(':id')
  getPermission(@Param('id') id: string) {
    return this.permissionsService.getPermission(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['PERMISSION'], ['PERMISSION_CREATE']])
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['PERMISSION'], ['PERMISSION_UPDATE']])
  @Patch(':id')
  updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.updatePermission(id, updatePermissionDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions([['ADMIN'], ['PERMISSION'], ['PERMISSION_DELETE']])
  @HttpCode(204)
  @Delete(':id')
  deletePermission(@Param('id') id: string) {
    return this.permissionsService.deletePermission(id);
  }
}
