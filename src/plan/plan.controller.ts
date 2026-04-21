import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { FindAllPlanDto } from './dto/find-all-plan.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  public create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  public findAll(@Body() filter: FindAllPlanDto) {
    return this.planService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  public findOne(@Param('id') id: number) {
    return this.planService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  public update(@Param('id') id: number, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(id, updatePlanDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  public remove(@Param('id') id: number) {
    this.planService.remove(id);
    return {
      done: true,
    };
  }
}
