import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { FindAllPermissionDto } from './dto/find-all-permission.dto';
import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';
import { PermissionsStore } from 'src/shared/permission.object';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  public create(createPermissionDto: CreatePermissionDto) {
    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  public findAll(filter: FindAllPermissionDto) {
    const query = this.permissionRepository
      .createQueryBuilder('permission')
      .where('true');

    generateQuerySorts<Permission>(query, filter, Permission, 'permission');

    generateQueryConditions<Permission>(query, filter, 'permission');

    return customPaginate<Permission, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    permissionOptions: FindOptionsWhere<Permission>,
    options?: {
      selected?: FindOptionsSelect<Permission>;
      relations?: FindOptionsRelations<Permission>;
    },
  ) {
    return this.permissionRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: permissionOptions,
    });
  }

  public async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    await this.permissionRepository.update(id, updatePermissionDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.permissionRepository.delete(id);
  }

  public async syncPermissions() {
    const existingPermissions = await this.permissionRepository.find({
      select: ['name'],
    });

    const existingKeys = new Set(existingPermissions.map((perm) => perm.name));

    const newPermissions = Object.entries(PermissionsStore)
      .filter(([, value]) => !existingKeys.has(value as string))
      .map(([, value]) => ({ name: value }));

    if (newPermissions.length > 0) {
      await this.permissionRepository.insert(newPermissions as Permission[]);
      console.log(`Added ${newPermissions.length} new permissions.`);
    } else console.log('All permissions are already synced.');
  }
}
