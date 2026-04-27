import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateEmployeePermissionDto } from './dto/create-employee_permission.dto';
import { UpdateEmployeePermissionDto } from './dto/update-employee_permission.dto';
import { EmployeePermission } from './entities/employee_permission.entity';
import { FindAllEmployeePermissionDto } from './dto/find-all-employee-permission.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class EmployeePermissionService {
  constructor(
    @InjectRepository(EmployeePermission)
    private readonly employeePermissionRepository: Repository<EmployeePermission>,
  ) {}

  public create(createEmployeePermissionDto: CreateEmployeePermissionDto) {
    const employeePermission = this.employeePermissionRepository.create(
      createEmployeePermissionDto,
    );
    return this.employeePermissionRepository.save(employeePermission);
  }

  public findAll(filter: FindAllEmployeePermissionDto) {
    const query = this.employeePermissionRepository
      .createQueryBuilder('employeePermission')
      .where('true');

    generateQuerySorts<EmployeePermission>(
      query,
      filter,
      EmployeePermission,
      'employeePermission',
    );

    generateQueryConditions<EmployeePermission>(
      query,
      filter,
      'employeePermission',
    );

    return customPaginate<EmployeePermission, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    employeePermissionOptions: FindOptionsWhere<EmployeePermission>,
    options?: {
      selected?: FindOptionsSelect<EmployeePermission>;
      relations?: FindOptionsRelations<EmployeePermission>;
    },
  ) {
    return this.employeePermissionRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: employeePermissionOptions,
    });
  }

  public async update(
    id: number,
    updateEmployeePermissionDto: UpdateEmployeePermissionDto,
  ) {
    await this.employeePermissionRepository.update(
      id,
      updateEmployeePermissionDto,
    );
    return this.findOne({ id });
  }

  public async removePermission(
    employeePermissionOptions: FindOptionsWhere<EmployeePermission>,
  ) {
    await this.employeePermissionRepository.delete(employeePermissionOptions);
  }
}
