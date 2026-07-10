import { Injectable, NotFoundException } from '@nestjs/common';
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
import { EmployeeNetwork } from 'src/employee-network/entities/employee-network.entity';
import { EmployeeNetworkService } from 'src/employee-network/employee-network.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly employeePermissionService: EmployeePermissionService,
    private readonly permissionService: PermissionService,
    private readonly employeeNetworkService: EmployeeNetworkService,
  ) {}
  public async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(createEmployeeDto);

    employee.employee_networks = [];

    for (const networkId of createEmployeeDto.network_ids) {
      const employeeNetwork = new EmployeeNetwork();

      employeeNetwork.network_id = networkId;
      employeeNetwork.user_id = createEmployeeDto.user_id;

      employeeNetwork.employee = employee;

      employee.employee_networks.push(employeeNetwork);
    }

    return await this.employeeRepository.save(employee);
  }

  public findAll(filter: FindAllEmployeeDto) {
    const query = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect(
        'employee.employee_permissions',
        'employee_permissions',
      )
      .leftJoinAndSelect('employee_permissions.permission', 'permission')
      .leftJoinAndSelect('employee.employee_networks', 'employee_networks')
      .leftJoinAndSelect('employee_networks.network', 'network')
      .leftJoinAndSelect('employee.expenses', 'expenses')
      .leftJoinAndSelect('expenses.expense_type', 'expense_type')

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
    const findEmployee = await this.findOne(
      { id },
      { relations: { employee_networks: true } },
    );

    if (!findEmployee) {
      throw new NotFoundException('Employee not found');
    }

    if (
      updateEmployeeDto.network_ids &&
      updateEmployeeDto.network_ids.length > 0
    ) {
      if (findEmployee?.employee_networks?.length) {
        for (const oldItem of findEmployee.employee_networks) {
          this.employeeNetworkService.remove(oldItem.id);
        }
      }

      for (const networkId of updateEmployeeDto.network_ids) {
        await this.employeeNetworkService.create({
          employee_id: id,
          network_id: networkId,
          user_id: findEmployee.user_id,
        });
      }
    }
    const { network_ids, ...data } = updateEmployeeDto;

    await this.employeeRepository.update(id, {
      ...data,
    });

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
