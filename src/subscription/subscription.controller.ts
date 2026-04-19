import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { FindAllSubscriptionDto } from './dto/find-all-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  public create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Post('get-all')
  public findAll(@Body() filter: FindAllSubscriptionDto) {
    return this.subscriptionService.findAll(filter);
  }

  @Get('get-one/:id')
  public findOne(@Param('id') id: number) {
    return this.subscriptionService.findOne({ id });
  }

  @Patch('update/:id')
  public update(
    @Param('id') id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete('remove/:id')
  public remove(@Param('id') id: number) {
    this.subscriptionService.remove(id);
    return {
      done: true,
    };
  }
}
