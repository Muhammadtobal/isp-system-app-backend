import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";

import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { Admin } from "./entities/admin.entity";
import { FindAllAdminDto } from "./dto/find-all-admin.dto";

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from "src/shared/helpers";
import { PaginationMetadata } from "src/shared/pagination-metadata";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  public create(createAdminDto: CreateAdminDto) {
    const admin = this.adminRepository.create(createAdminDto);
    return this.adminRepository.save(admin);
  }

  public findAll(filter: FindAllAdminDto) {
    const query = this.adminRepository
      .createQueryBuilder("admin")
      .where("true");

    generateQuerySorts<Admin>(query, filter, Admin, "admin");

    generateQueryConditions<Admin>(query, filter, "admin");

    return customPaginate<Admin, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    adminOptions: FindOptionsWhere<Admin>,
    options?: {
      selected?: FindOptionsSelect<Admin>;
      relations?: FindOptionsRelations<Admin>;
    },
  ) {
    return this.adminRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: adminOptions,
    });
  }

  public async update(id: number, updateAdminDto: UpdateAdminDto) {
    await this.adminRepository.update(id, updateAdminDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.adminRepository.delete(id);
  }
}
