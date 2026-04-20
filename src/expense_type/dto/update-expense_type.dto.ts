import { PartialType } from '@nestjs/swagger';
import { CreateExpenseTypeDto } from './create-expense_type.dto';

export class UpdateExpenseTypeDto extends PartialType(CreateExpenseTypeDto) {}
