import { forwardRef, Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "src/auth/auth.module";
import { Admin } from "./entities/admin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), forwardRef(() => AuthModule)],
  exports: [AdminService],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
