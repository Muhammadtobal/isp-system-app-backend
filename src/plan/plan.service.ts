import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { FindAllPlanDto } from './dto/find-all-plan.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  public create(createPlanDto: CreatePlanDto) {
    const plan = this.planRepository.create(createPlanDto);
    return this.planRepository.save(plan);
  }

  public findAll(filter: FindAllPlanDto) {
    const query = this.planRepository.createQueryBuilder('plan').where('true');

    generateQuerySorts<Plan>(query, filter, Plan, 'plan');

    generateQueryConditions<Plan>(query, filter, 'plan');

    return customPaginate<Plan, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    planOptions: FindOptionsWhere<Plan>,
    options?: {
      selected?: FindOptionsSelect<Plan>;
      relations?: FindOptionsRelations<Plan>;
    },
  ) {
    return this.planRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: planOptions,
    });
  }

  public async update(id: number, updatePlanDto: UpdatePlanDto) {
    await this.planRepository.update(id, updatePlanDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.planRepository.delete(id);
  }
}
