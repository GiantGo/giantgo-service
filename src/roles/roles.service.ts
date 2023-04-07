import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private permissionService: PermissionsService,
  ) {}

  async getRoleList(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async getRole(id: string): Promise<Role> {
    const qb = this.rolesRepository
      .createQueryBuilder()
      .where({
        id,
      })
      .leftJoin('Role.permissions', 'Permission')
      .select(['Role', 'Permission.slug']);

    return qb.getOne();
  }

  async findByIds(ids: Array<string>): Promise<Role[]> {
    return this.rolesRepository.createQueryBuilder().whereInIds(ids).getMany();
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const exist = await this.rolesRepository.findOne({
      where: { slug: createRoleDto.slug },
    });

    if (exist) {
      throw new HttpException('编码已存在', HttpStatus.BAD_REQUEST);
    }

    const role = new Role();

    role.name = createRoleDto.name;
    role.slug = createRoleDto.slug;
    role.description = createRoleDto.description;

    return this.rolesRepository.save(role);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    }

    const qb = this.rolesRepository.createQueryBuilder();

    qb.where({
      id: Not(id),
    }).andWhere({
      slug: updateRoleDto.slug,
    });

    const exist = await qb.getCount();

    if (exist) {
      throw new HttpException('编码已存在', HttpStatus.BAD_REQUEST);
    }

    const updated = Object.assign(role, updateRoleDto);

    return this.rolesRepository.save(updated);
  }

  async deleteRole(id: string) {
    const role = await this.rolesRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    }

    return this.rolesRepository.softDelete(id);
  }

  async assignPermissions(id: string, permissionIds: Array<string>) {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) {
      throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    }

    const permissions = await this.permissionService.findByIds(permissionIds);

    const updated = Object.assign(role, {
      permissions,
    });

    return this.rolesRepository.save(updated);
  }
}
