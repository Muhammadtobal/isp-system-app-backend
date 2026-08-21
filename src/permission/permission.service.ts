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
import {
  PermissionISP,
  PermissionKey,
  PermissionMetadata,
} from 'src/shared/permission.object';

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
    const existingPermissions = await this.permissionRepository.find();

    const existingMap = new Map(
      existingPermissions.map((permission) => [permission.name, permission]),
    );

    const newPermissions: Partial<Permission>[] = [];
    const permissionsToUpdate: Permission[] = [];

    for (const key of Object.keys(PermissionISP) as PermissionKey[]) {
      const name = PermissionISP[key];
      const metadata = PermissionMetadata[key];

      const existingPermission = existingMap.get(name);

      if (!existingPermission) {
        newPermissions.push({
          name,

          key: metadata.key,

          description: metadata.description,
          translation: metadata.translation,
          visual_for_user: true,
        });

        continue;
      }

      // ✅ تحديث الـ key أيضًا
      existingPermission.key = metadata.key;

      existingPermission.description = metadata.description;
      existingPermission.translation = metadata.translation;
      existingPermission.visual_for_user = true;

      permissionsToUpdate.push(existingPermission);
    }

    if (newPermissions.length > 0) {
      await this.permissionRepository.insert(newPermissions);
    }

    if (permissionsToUpdate.length > 0) {
      await this.permissionRepository.save(permissionsToUpdate);
    }

    console.log(
      `Permissions synced. Added: ${newPermissions.length}, Updated: ${permissionsToUpdate.length}`,
    );
  }
}
