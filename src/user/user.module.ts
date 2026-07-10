import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/shared/nodemailer';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  exports: [UserService, MailService],
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule {}
