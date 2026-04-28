import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';
import { User } from './entities/user.entity';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  public async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userService.create({
      ...createUserDto,
    });

    return this.userService.findOne({ id: user.id });
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + User.name)
  public async findAll(
    @Body() filter: FindAllUserDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    if (user.role !== 'admin') {
      throw new HttpException('غير مصرح لك', HttpStatus.BAD_REQUEST);
    }

    const users = await this.userService.findAll(filter);

    const safeItems = users.items.map((u) => {
      const { password, ...rest } = u;
      return rest;
    });

    return {
      data: {
        ...users,
        items: safeItems,
      },
    };
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + User.name)
  @UseGuards(JwtAuthUserGuard)
  public async findOne(@Param('id') id: number, @Request() req: any) {
    // const userReq = getUser(req.user);
    // if (userReq.role !== 'admin') {
    //   throw new HttpException('غير مصرح لك', HttpStatus.BAD_REQUEST);
    // }
    const user = await this.userService.findOne({ id });
    if (!user) {
      throw new HttpException('المستخدم غير موجود', HttpStatus.NOT_FOUND);
    }
    const { password, ...userSaved } = user;
    return userSaved;
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.UPDATE + User.name)
  @UseGuards(JwtAuthUserGuard)
  public async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    // const userReq = getUser(req.user);
    // if (userReq.role !== 'admin') {
    //   throw new HttpException('غير مصرح لك', HttpStatus.BAD_REQUEST);
    // }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const data = await this.userService.update(id, updateUserDto);
    if (!data) {
      throw new HttpException('المستخدم غير موجود', HttpStatus.NOT_FOUND);
    }

    const { password, ...safeUser } = data;

    return safeUser;
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.DELETE + User.name)
  public remove(@Param('id') id: number, @CurrentUser() req: AuthUser) {
    const userReq = req;
    if (userReq.role !== 'admin') {
      throw new HttpException('غير مصرح لك', HttpStatus.BAD_REQUEST);
    }

    this.userService.remove(id);
    return {
      done: true,
    };
  }

  // @Get('my-profile')
  // @UseGuards(JwtAuthUserGuard)
  // public async myProfile(@Request() req: any) {
  //   const user = getUser(req.user);

  //   if (user === '0') return;

  //   const data = await this.userService.findOne({
  //     id: user.userId,
  //   });

  //   if (!data) return;

  //   const { password, ...safeUser } = data;

  //   return safeUser;
  // }

  // @Patch('my-update')
  // @UseGuards(JwtAuthUserGuard)
  // public async myUpdate(
  //   @Request() req: any,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   const user = getUser(req.user);

  //   if (user === '0') return;
  //   if (updateUserDto.password && updateUserDto.password.trim() !== '') {
  //     updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
  //   }
  //   const updatedUser = await this.userService.update(
  //     user.userId,
  //     updateUserDto,
  //   );

  //   if (!updatedUser) {
  //     return { message: 'User not found' };
  //   }

  //   const { password, active, role, ...safeUser } = updatedUser;

  //   return safeUser;
  // }

  @Get('users-statistics')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + User.name)
  async usersStatistics(@CurrentUser() req: AuthUser) {
    const user = req;

    if (user.role !== 'admin') {
      throw new HttpException('غير مصرح لك', HttpStatus.BAD_REQUEST);
    }

    let totalUsers = 0;
    let activeUsers = 0;
    let inactiveUsers = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.userService.findAll({
        pagination: { page, limit },
      });

      if (!result.items.length) break;

      for (const u of result.items) {
        totalUsers++;

        if (u.active) activeUsers++;
        else inactiveUsers++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
    };
  }
}
