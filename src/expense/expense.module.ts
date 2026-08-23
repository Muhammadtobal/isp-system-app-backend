import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { CurrencyModule } from 'src/currency/currency.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), CurrencyModule],
  exports: [ExpenseService],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
