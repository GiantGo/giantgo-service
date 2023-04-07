import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Not } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  getPermissionList(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  getPermissionTree(): Promise<Permission[]> {
    return this.dataSource.getTreeRepository(Permission).findTrees();
  }

  getPermission(id: string): Promise<Permission> {
    return this.permissionsRepository.findOne({
      where: { id },
    });
  }

  async findByIds(ids: Array<string>): Promise<Permission[]> {
    return this.permissionsRepository
      .createQueryBuilder()
      .whereInIds(ids)
      .getMany();
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const exist = await this.permissionsRepository.findOne({
      where: { slug: createPermissionDto.slug },
    });

    if (exist) {
      throw new HttpException('编码已存在', HttpStatus.BAD_REQUEST);
    }

    const permission = new Permission();

    permission.name = createPermissionDto.name;
    permission.slug = createPermissionDto.slug;

    if (createPermissionDto.parentId) {
      permission.parent = await this.getPermission(
        createPermissionDto.parentId,
      );
    }

    return this.permissionsRepository.save(permission);
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new HttpException('权限不存在', HttpStatus.BAD_REQUEST);
    }

    const qb = this.permissionsRepository.createQueryBuilder();

    qb.where({
      id: Not(id),
    }).andWhere({
      slug: updatePermissionDto.slug,
    });

    const exist = await qb.getCount();

    if (exist) {
      throw new HttpException('编码已存在', HttpStatus.BAD_REQUEST);
    }

    const updated = Object.assign(permission, updatePermissionDto);

    return this.permissionsRepository.save(updated);
  }

  async deletePermission(id: string) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new HttpException('权限不存在', HttpStatus.BAD_REQUEST);
    }

    return this.permissionsRepository.softDelete(id);
  }
}
