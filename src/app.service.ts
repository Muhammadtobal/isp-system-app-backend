import { Injectable } from '@nestjs/common';
import { Permission } from './permission/entities/permission.entity';
import { DataSource } from 'typeorm';
import { PermissionService } from './permission/permission.service';
import * as si from 'systeminformation';

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

  async getServerInfo() {
    const [os, cpu, mem, currentLoad, fs, temp, time] = await Promise.all([
      si.osInfo(),
      si.cpu(),
      si.mem(),
      si.currentLoad(),
      si.fsSize(),
      si.cpuTemperature(),
      si.time(),
    ]);

    return {
      os: {
        platform: os.platform,
        distro: os.distro,
        release: os.release,
        arch: os.arch,
      },

      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        speed: cpu.speed,
        usage: currentLoad.currentLoad.toFixed(2) + '%',
        temperature: temp.main ? `${temp.main} °C` : 'N/A',
      },

      memory: {
        total: (mem.total / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        used: (mem.used / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        free: (mem.free / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        usage: ((mem.used / mem.total) * 100).toFixed(2) + '%',
      },

      disks: fs.map((disk) => ({
        fs: disk.fs,
        mount: disk.mount,
        total: (disk.size / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        used: (disk.used / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        usage: disk.use + '%',
      })),

      uptime: time.uptime,

      node: process.version,

      process: {
        pid: process.pid,
        memory: (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + ' MB',
      },
    };
  }
}
