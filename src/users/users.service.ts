import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeleteResult, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<{ items: User[]; total: number }> {
    const [items, total] = await this.usersRepository.findAndCount();
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

    return this.usersRepository.save(createUserDto);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    return this.usersRepository.softDelete(id);
  }
}
