import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindAllUserDto } from './dto/find-all-user.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  public findAll(filter: FindAllUserDto) {
    const query = this.userRepository.createQueryBuilder('user').where('true');

    generateQuerySorts<User>(query, filter, User, 'user');

    generateQueryConditions<User>(query, filter, 'user');

    return customPaginate<User, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    userOptions: FindOptionsWhere<User>,
    options?: {
      selected?: FindOptionsSelect<User>;
      relations?: FindOptionsRelations<User>;
    },
  ) {
    return this.userRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: userOptions,
    });
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);

    return this.findOne({ id });
  }

  public remove(id: number) {
    this.userRepository.delete(id);
  }
}
