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
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class EmployeeNetworkService {
  constructor(
    @InjectRepository(EmployeeNetwork)
    private readonly employeeNetworkRepository: Repository<EmployeeNetwork>,
    private readonly employeeService: EmployeeService,
  ) {}

  public async create(createEmployeeNetworkDto: CreateEmployeeNetworkDto) {
    const employeeNetwork = this.employeeNetworkRepository.create(
      createEmployeeNetworkDto,
    );
    const employee = await this.employeeService.findOne({
      email: createEmployeeNetworkDto.email,
    });
    if (!employee) {
      throw new HttpException('not found', HttpStatus.BAD_REQUEST);
    }
    employeeNetwork.employee_id = employee.id;
    return this.employeeNetworkRepository.save(employeeNetwork);
  }

  public findAll(filter: any) {
    const query = this.employeeNetworkRepository
      .createQueryBuilder('employee_network')
      .leftJoinAndSelect('employee_network.network', 'network')
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
