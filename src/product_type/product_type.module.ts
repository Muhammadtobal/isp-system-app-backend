import { Module } from '@nestjs/common';
import { ProductTypeService } from './product_type.service';
import { ProductTypeController } from './product_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './entities/product_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType])],

  controllers: [ProductTypeController],
  providers: [ProductTypeService],
})
export class ProductTypeModule {}
