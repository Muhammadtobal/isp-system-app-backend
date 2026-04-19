import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { FindAllPlanDto } from './dto/find-all-plan.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('create')
  public create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Post('get-all')
  public findAll(@Body() filter: FindAllPlanDto) {
    return this.planService.findAll(filter);
  }

  @Get('get-one/:id')
  public findOne(@Param('id') id: number) {
    return this.planService.findOne({ id });
  }

  @Patch('update/:id')
  public update(@Param('id') id: number, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(id, updatePlanDto);
  }

  @Delete('remove/:id')
  public remove(@Param('id') id: number) {
    this.planService.remove(id);
    return {
      done: true,
    };
  }
}
