import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FindAllPaymentDto } from './dto/find-all-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  public create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Post('get-all')
  public findAll(@Body() filter: FindAllPaymentDto) {
    return this.paymentService.findAll(filter);
  }

  @Get('get-one/:id')
  public findOne(@Param('id') id: number) {
    return this.paymentService.findOne({ id });
  }

  @Patch('update/:id')
  public update(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete('remove/:id')
  public remove(@Param('id') id: number) {
    this.paymentService.remove(id);
    return {
      done: true,
    };
  }
}
