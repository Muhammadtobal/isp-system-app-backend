import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { FindAllSubscriptionDto } from './dto/find-all-subscription.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { getUser } from 'src/shared/helpers';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  public create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Request() req: any,
  ) {
    const user = getUser(req.user);
    if (user.role !== 'admin') {
      createSubscriptionDto.user_id = user.userId;
    }
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  public findAll(@Body() filter: FindAllSubscriptionDto) {
    return this.subscriptionService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  public findOne(@Param('id') id: number) {
    return this.subscriptionService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  public update(
    @Param('id') id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  public remove(@Param('id') id: number) {
    this.subscriptionService.remove(id);
    return {
      done: true,
    };
  }
}
