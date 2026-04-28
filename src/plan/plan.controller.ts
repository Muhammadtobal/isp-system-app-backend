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
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { FindAllPlanDto } from './dto/find-all-plan.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Plan } from './entities/plan.entity';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Plan.name)
  public create(
    @Body() createPlanDto: CreatePlanDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      createPlanDto.user_id = user.userId;
    }
    return this.planService.create(createPlanDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Plan.name)
  public findAll(@Body() filter: FindAllPlanDto) {
    return this.planService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Plan.name)
  public findOne(@Param('id') id: number) {
    return this.planService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Plan.name)
  public update(@Param('id') id: number, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(id, updatePlanDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Plan.name)
  public remove(@Param('id') id: number) {
    this.planService.remove(id);
    return {
      done: true,
    };
  }

  @Get('plans-statistics')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Plan.name)
  public async plansStatistics(@CurrentUser() req: AuthUser) {
    const user = req;

    let user_id;
    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    let totalPlans = 0;
    let activePlans = 0;
    let inactivePlans = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.planService.findAll({
        pagination: { page, limit },
        user_id: { value: user_id },
      });

      if (!result.items.length) break;

      for (const p of result.items) {
        totalPlans++;

        if (p.active) activePlans++;
        else inactivePlans++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalPlans,
      activePlans,
      inactivePlans,
    };
  }
}
