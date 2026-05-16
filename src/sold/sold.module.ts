import { Module } from '@nestjs/common';
import { SoldService } from './sold.service';
import { SoldController } from './sold.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sold } from './entities/sold.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sold]), ProductModule],

  controllers: [SoldController],
  providers: [SoldService],
})
export class SoldModule {}
