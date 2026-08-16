import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { EmployeeNetwork } from './entities/employee-network.entity';
import { CreateEmployeeNetworkDto } from './dto/create-employee-network.dto';
import { UpdateEmployeeNetworkDto } from './dto/update-employee-network.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';
import { FindAllEmployeeNetworkDto } from './dto/find-all-employee-network.dto';

@Injectable()
export class EmployeeNetworkService {
  constructor(
    @InjectRepository(EmployeeNetwork)
    private readonly employeeNetworkRepository: Repository<EmployeeNetwork>,
  ) {}

  public async create(createEmployeeNetworkDto: CreateEmployeeNetworkDto) {
    const employeeNetwork = this.employeeNetworkRepository.create(
      createEmployeeNetworkDto,
    );

    return this.employeeNetworkRepository.save(employeeNetwork);
  }

  public findAll(filter: FindAllEmployeeNetworkDto) {
    const query = this.employeeNetworkRepository
      .createQueryBuilder('employee_network')
      .leftJoinAndSelect('employee_network.network', 'network')

      .leftJoinAndSelect('employee_network.employee', 'employee')
      .leftJoinAndSelect(
        'employee.employee_permissions',
        'employee_permissions',
      )
      .leftJoinAndSelect('employee_permissions.permission', 'permission')
      .leftJoinAndSelect('employee.expenses', 'expenses')
      .leftJoinAndSelect('expenses.expense_type', 'expense_type')
      .where('true');

    generateQuerySorts<EmployeeNetwork>(
      query,
      filter,
      EmployeeNetwork,
      'employee_network',
    );

    generateQueryConditions<EmployeeNetwork>(query, filter, 'employee_network');

    return customPaginate<EmployeeNetwork, PaginationMetadata>(query, {
      limit: filter?.pagination?.limit,
      page: filter?.pagination?.page,
    });
  }

  public findOne(
    optionsWhere: FindOptionsWhere<EmployeeNetwork>,
    options?: {
      selected?: FindOptionsSelect<EmployeeNetwork>;
      relations?: FindOptionsRelations<EmployeeNetwork>;
    },
  ) {
    return this.employeeNetworkRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: optionsWhere,
    });
  }

  public async update(id: number, updateDto: UpdateEmployeeNetworkDto) {
    await this.employeeNetworkRepository.update(id, updateDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.employeeNetworkRepository.delete(id);
  }
}
