import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ExpenseTypeService } from './expense_type.service';
import { CreateExpenseTypeDto } from './dto/create-expense_type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense_type.dto';
import { FindAllExpenseTypeDto } from './dto/find-all-expense-type.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

@Controller('expense-type')
export class ExpenseTypeController {
  constructor(private readonly expenseTypeService: ExpenseTypeService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  create(@Body() createExpenseTypeDto: CreateExpenseTypeDto) {
    return this.expenseTypeService.create(createExpenseTypeDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  findAll(@Body() filter: FindAllExpenseTypeDto) {
    return this.expenseTypeService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expenseTypeService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseTypeDto: UpdateExpenseTypeDto,
  ) {
    return this.expenseTypeService.update(id, updateExpenseTypeDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.expenseTypeService.remove(id);
    return {
      done: true,
    };
  }
}
