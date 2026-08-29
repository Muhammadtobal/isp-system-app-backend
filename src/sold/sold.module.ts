import { forwardRef, Module } from '@nestjs/common';
import { SoldService } from './sold.service';
import { SoldController } from './sold.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sold } from './entities/sold.entity';
import { ProductModule } from 'src/product/product.module';
import { CurrencyModule } from 'src/currency/currency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sold]),
    forwardRef(() => ProductModule),
    CurrencyModule,
  ],
  exports: [SoldService],
  controllers: [SoldController],
  providers: [SoldService],
})
export class SoldModule {}
