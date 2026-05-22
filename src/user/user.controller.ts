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
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser, buildFileUrl } from 'src/shared/helpers';
import { User } from './entities/user.entity';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { ErrorMessages } from 'src/shared/error-messages.object';
import { MulterImageConfigInterceptor } from 'src/shared/helpers';
import { ApiConsumes } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import {
  ForgotPasswordInput,
  ResetPasswordInput,
} from './dto/forget-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('create')
  @UseInterceptors(MulterImageConfigInterceptor)
  public async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    let imageUrl: string | undefined;

    const user = await this.userService.create({
      ...createUserDto,
    });

    if (logo) {
      const uploadFolder = process.env.DESTINATION || 'uploads';

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      const fileName = `${Date.now()}-${logo.originalname}`;

      const filePath = path.join(uploadFolder, fileName);

      fs.writeFileSync(filePath, logo.buffer);

      imageUrl = `${uploadFolder}/${fileName}`;

      await this.userService.update(user.id, {
        logo: imageUrl,
      });
    }

    return this.userService.findOne({
      id: user.id,
    });
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
      throw new HttpException(
        ErrorMessages.NOT_ALLOWED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const users = await this.userService.findAll(filter);

    const safeItems = users.items.map((u) => {
      const { password, ...rest } = u;

      return {
        ...rest,
        logo: buildFileUrl(rest.logo),
      };
    });

    return {
      ...users,
      items: safeItems,
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
    const user = await this.userService.findOne(
      { id },
      { relations: { networks: true } },
    );
    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND_USER,
        HttpStatus.NOT_FOUND,
      );
    }
    const { password, ...userSaved } = user;
    return {
      ...userSaved,
      logo: buildFileUrl(userSaved.logo),
    };
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  @UseInterceptors(MulterImageConfigInterceptor)
  @Permissions(Operation.UPDATE + User.name)
  @UseGuards(JwtAuthUserGuard)
  public async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    const existingUser = await this.userService.findOne({ id });

    if (!existingUser) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND_USER,
        HttpStatus.NOT_FOUND,
      );
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (logo) {
      const fileName = `${Date.now()}-${logo.originalname}`;

      const uploadPath = path.join(
        process.cwd(),
        process.env.DESTINATION || 'uploads',
        fileName,
      );

      fs.writeFileSync(uploadPath, logo.buffer);

      if (existingUser.logo) {
        const oldPath = path.join(process.cwd(), existingUser.logo);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateUserDto.logo = `uploads/${fileName}`;
    }

    const data = await this.userService.update(id, updateUserDto);

    if (!data) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND_USER,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password, ...safeUser } = data;

    return {
      ...safeUser,
      logo: buildFileUrl(safeUser.logo),
    };
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.DELETE + User.name)
  public remove(@Param('id') id: number, @CurrentUser() req: AuthUser) {
    const userReq = req;
    if (userReq.role !== 'admin') {
      throw new HttpException(
        ErrorMessages.NOT_ALLOWED,
        HttpStatus.UNAUTHORIZED,
      );
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
      throw new HttpException(
        ErrorMessages.NOT_ALLOWED,
        HttpStatus.BAD_REQUEST,
      );
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

  @Post('forgot-password')
  async forgotPassword(@Body() input: ForgotPasswordInput) {
    return this.userService.forgotPassword(input.email);
  }
  @Post('reset-password')
  async resetPassword(@Body() input: ResetPasswordInput) {
    await this.userService.resetPassword(input.token, input.newPassword);

    return {
      done: true,
    };
  }
}
