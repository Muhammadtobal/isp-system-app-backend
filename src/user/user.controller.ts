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
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { getUser } from 'src/shared/helpers';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  public async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const refreshToken = this.authService.generateRefreshToken();

    const user = await this.userService.create({
      ...createUserDto,
      refresh_token: refreshToken,
    });

    return this.userService.findOne({ id: user.id });
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  public findAll(@Body() filter: FindAllUserDto) {
    return this.userService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  public findOne(@Param('id') id: number) {
    return this.userService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  public update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  public remove(@Param('id') id: number) {
    this.userService.remove(id);
    return {
      done: true,
    };
  }

  @Get('my-profile')
  @UseGuards(JwtAuthUserGuard)
  public async myProfile(@Request() req: any) {
    const user = getUser(req.user);

    if (user === '0') return;

    const data = await this.userService.findOne({
      id: user.userId,
    });

    if (!data) return;

    const { password, refresh_token, active, role, ...safeUser } = data;

    return safeUser;
  }

  @Patch('my-update')
  @UseGuards(JwtAuthUserGuard)
  public async myUpdate(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = getUser(req.user);

    if (user === '0') return;

    const updatedUser = await this.userService.update(
      user.userId,
      updateUserDto,
    );

    if (!updatedUser) {
      return { message: 'User not found' };
    }

    const { password, refresh_token, active, role, ...safeUser } = updatedUser;

    return safeUser;
  }
}
