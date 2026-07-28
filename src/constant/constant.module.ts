import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConstantService } from './constant.service';
import { Constant } from './entities/constant.entity';
import { AppModule } from 'src/app.module';
import { ConstantController } from './constant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Constant])],
  providers: [ConstantService],
  controllers: [ConstantController],
  exports: [ConstantService],
})
export class ConstantModule {}
