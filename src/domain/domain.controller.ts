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
import { DomainService } from './domain.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { FindAllDomainDto } from './dto/find-all-domain.dto';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';

import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';

import { Operation } from 'src/shared/enums/operation..enum';

import { AuthUser } from 'src/shared/helpers';

import { Domain } from './entities/domain.entity';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

@Controller('domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.CREATE + Domain.name)
  public create(
    @Body() createDomainDto: CreateDomainDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    if (user.role !== 'admin') {
      createDomainDto.user_id = user.userId;
    }

    return this.domainService.create(createDomainDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + Domain.name)
  public findAll(@Body() filter: FindAllDomainDto) {
    return this.domainService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + Domain.name)
  public findOne(@Param('id') id: number) {
    return this.domainService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.UPDATE + Domain.name)
  public update(
    @Param('id') id: number,
    @Body() updateDomainDto: UpdateDomainDto,
  ) {
    return this.domainService.update(id, updateDomainDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.DELETE + Domain.name)
  public remove(@Param('id') id: number) {
    this.domainService.remove(id);

    return {
      done: true,
    };
  }

  @Get('domains-statistics')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + Domain.name)
  public async domainsStatistics(@CurrentUser() req: AuthUser) {
    const user = req;

    let user_id;

    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    let totalDomains = 0;
    let activeDomains = 0;
    let inactiveDomains = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.domainService.findAll({
        pagination: { page, limit },
        user_id: { value: Number(user_id) },
      });

      if (!result.items.length) break;

      for (const d of result.items) {
        totalDomains++;

        if (d.active) activeDomains++;
        else inactiveDomains++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalDomains,
      activeDomains,
      inactiveDomains,
    };
  }
}
