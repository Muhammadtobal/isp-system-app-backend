import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { FindAllEmployeeDto } from './dto/find-all-employee.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { EmployeePermissionService } from 'src/employee_permission/employee_permission.service';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly employeePermissionService: EmployeePermissionService,
    private readonly permissionService: PermissionService,
  ) {}

  public create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  public findAll(filter: FindAllEmployeeDto) {
    const query = this.employeeRepository
      .createQueryBuilder('employee')
      .where('true');

    generateQuerySorts<Employee>(query, filter, Employee, 'employee');

    generateQueryConditions<Employee>(query, filter, 'employee');

    return customPaginate<Employee, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    employeeOptions: FindOptionsWhere<Employee>,
    options?: {
      selected?: FindOptionsSelect<Employee>;
      relations?: FindOptionsRelations<Employee>;
    },
  ) {
    return this.employeeRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: employeeOptions,
    });
  }

  public async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    await this.employeeRepository.update(id, updateEmployeeDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.employeeRepository.delete(id);
  }

  public async assignPermission(assignPermissionDto: AssignPermissionDto) {
    const employee = await this.findOne({
      id: assignPermissionDto.employee_id,
    });

    if (!employee) return false;

    for (const permission_id of assignPermissionDto.permission_ids) {
      const permission = await this.permissionService.findOne({
        id: permission_id,
      });

      if (!permission) continue;

      await this.employeePermissionService.create({
        employee_id: assignPermissionDto.employee_id,
        permission_id,
        user_id: assignPermissionDto.user_id,
      });
    }

    return true;
  }

  public async unassignPermission(unassignPermissionDto: AssignPermissionDto) {
    const employee = await this.findOne({
      id: unassignPermissionDto.employee_id,
    });

    if (!employee) return false;

    for (const permission_id of unassignPermissionDto.permission_ids) {
      await this.employeePermissionService.removePermission({
        employee_id: unassignPermissionDto.employee_id,
        permission_id,
      });
    }

    return true;
  }
}
