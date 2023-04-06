import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Like, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async find(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: {
        roles: true,
      },
    });
  }

  async findOne(username: string): Promise<User> {
    const qb = this.usersRepository.createQueryBuilder();

    qb.where([
      { username: username },
      { email: username },
      { mobile: username },
    ]).addSelect('User.password');

    return qb.getOne();
  }

  async findAll(
    query: QueryUserDto,
  ): Promise<{ items: User[]; total: number }> {
    const { current, size, keyword } = query;
    const qb = this.usersRepository.createQueryBuilder();

    if (keyword) {
      qb.where({
        username: Like(`%${keyword}%`),
      });

      qb.orWhere({
        email: Like(`%${keyword}%`),
      });

      qb.orWhere({
        mobile: Like(`%${keyword}%`),
      });
    }

    const total = await qb.getCount();

    if (current) {
      qb.offset((query.current - 1) * query.size);
    }

    if (size) {
      qb.limit(query.size);
    }

    const items = await qb.getMany();

    return { items, total };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const users = await this.usersRepository.find({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
        { mobile: createUserDto.mobile },
      ],
    });

    if (users.length) {
      throw new HttpException('用户已注册，请登录', HttpStatus.BAD_REQUEST);
    }

    const user = new User();

    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.mobile = createUserDto.mobile;
    user.password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(),
    );

    return this.usersRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const qb = this.usersRepository.createQueryBuilder();

    qb.where({
      id: Not(id),
    });

    const uniqueOr = [];

    if (updateUserDto.email) {
      uniqueOr.push({
        email: updateUserDto.email,
      });
    }

    if (updateUserDto.mobile) {
      uniqueOr.push({
        mobile: updateUserDto.mobile,
      });
    }

    qb.andWhere(uniqueOr);

    const exist = await qb.getCount();

    if (exist) {
      throw new HttpException('邮箱或者手机号已注册', HttpStatus.BAD_REQUEST);
    }

    const updated = Object.assign(user, updateUserDto);

    return this.usersRepository.save(updated);
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    return this.usersRepository.softDelete(id);
  }

  async assignRoles(id: string, roleIds: Array<string>) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const roles = await this.rolesService.findIds(roleIds);

    console.log(roles);

    const updated = Object.assign(user, {
      roles,
    });

    return this.usersRepository.save(updated);
  }
}
