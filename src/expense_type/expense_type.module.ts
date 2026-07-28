import { Module } from '@nestjs/common';
import { ExpenseTypeService } from './expense_type.service';
import { ExpenseTypeController } from './expense_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseType } from './entities/expense_type.entity';
import { ExpenseModule } from 'src/expense/expense.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseType]), ExpenseModule],

  controllers: [ExpenseTypeController],
  providers: [ExpenseTypeService],
})
export class ExpenseTypeModule {}
