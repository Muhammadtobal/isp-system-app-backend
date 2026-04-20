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

import { ExpenseTypeService } from './expense_type.service';
import { CreateExpenseTypeDto } from './dto/create-expense_type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense_type.dto';
import { FindAllExpenseTypeDto } from './dto/find-all-expense-type.dto';

@Controller('expense-type')
export class ExpenseTypeController {
  constructor(private readonly expenseTypeService: ExpenseTypeService) {}

  @Post('create')
  create(@Body() createExpenseTypeDto: CreateExpenseTypeDto) {
    return this.expenseTypeService.create(createExpenseTypeDto);
  }

  @Post('get-all')
  findAll(@Body() filter: FindAllExpenseTypeDto) {
    return this.expenseTypeService.findAll(filter);
  }

  @Get('get-one/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expenseTypeService.findOne({ id });
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseTypeDto: UpdateExpenseTypeDto,
  ) {
    return this.expenseTypeService.update(id, updateExpenseTypeDto);
  }

  @Delete('remove/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.expenseTypeService.remove(id);
    return {
      done: true,
    };
  }
}
