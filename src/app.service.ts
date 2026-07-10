import { Injectable } from '@nestjs/common';
import { Permission } from './permission/entities/permission.entity';
import { DataSource } from 'typeorm';
import { PermissionService } from './permission/permission.service';

@Injectable()
export class AppService {
  private globalPermissions: Permission[];
  constructor(
    private readonly dataSource: DataSource,
    private readonly permissionService: PermissionService,
  ) {}
  async onModuleInit() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
    } finally {
      await queryRunner.release();
      await this.permissionService.syncPermissions();
      await this.setGlobalPermissions();
    }
  }

  public async setGlobalPermissions() {
    this.globalPermissions = (
      await this.permissionService.findAll({
        pagination: { limit: 10000, page: 1 },
      })
    ).items;

    console.log(this.globalPermissions);
  }
}
