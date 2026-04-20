import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FindAllExpenseDto } from './dto/find-all-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('create')
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Post('get-all')
  findAll(@Body() filter: FindAllExpenseDto) {
    return this.expenseService.findAll(filter);
  }

  @Get('get-one/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expenseService.findOne({ id });
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete('remove/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.expenseService.remove(id);
    return {
      done: true,
    };
  }
}
