import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

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
import { ErrorMessages } from 'src/shared/error-messages.object';
import { MailService } from 'src/shared/nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  public create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  public findAll(filter: FindAllUserDto) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.networks', 'networks')
      .where('true');

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

  public async forgotPassword(email: string) {
    const user = await this.findOne({ email, active: true });

    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND_USER,
        HttpStatus.NOT_FOUND,
      );
    }

    const token = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15);

    await this.userRepository.save(user);

    const link = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

    await this.mailService.sendResetPasswordEmail(user.email, link);

    return {
      done: true,
    };
  }

  public async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || !user.resetPasswordExpires) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
    }

    user.password = await bcrypt.hash(newPassword, 10);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);

    return true;
  }
}
