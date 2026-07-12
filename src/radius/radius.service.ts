import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { RadCheck } from './entities/ radcheck.entity';
import { RadReply } from './entities/radreply.entity';
import { RadAcct } from './entities/radacct.entity';
import { RadGroupCheck } from './entities/radgroupcheck.entity';
import { RadGroupReply } from './entities/radgroupreply.entity';
import { RadUserGroup } from './entities/radusergroup.entity';
import { CreatePppoeUserDto } from './dto/create-pppoe-user.dto';
import {
  CreateHotspotUserDto,
  HotspotUserResult,
} from './dto/create-hotspot-user.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  MikrotikAttributes,
  Operators,
  RadiusCheckAttributes,
  RadiusReplyAttributes,
} from './constants/radius-attributes';

@Injectable()
export class RadiusService {
  constructor(
    @InjectRepository(RadCheck)
    private readonly radCheckRepository: Repository<RadCheck>,

    @InjectRepository(RadReply)
    private readonly radReplyRepository: Repository<RadReply>,

    @InjectRepository(RadAcct)
    private readonly radAcctRepository: Repository<RadAcct>,

    @InjectRepository(RadGroupCheck)
    private readonly groupCheckRepo: Repository<RadGroupCheck>,

    @InjectRepository(RadGroupReply)
    private readonly groupReplyRepo: Repository<RadGroupReply>,

    @InjectRepository(RadUserGroup)
    private readonly userGroupRepo: Repository<RadUserGroup>,
  ) {}

  async createPppoeUser(dto: CreatePppoeUserDto) {
    const username =
      dto.generateUsername || !dto.username
        ? this.generateVoucherUsername()
        : dto.username;

    const password = dto.password || this.generateVoucherPassword();

    const checks = [...dto.checks];

    // إضافة كلمة المرور إذا لم تكن موجودة
    if (!checks.some((c) => c.attribute === 'Cleartext-Password')) {
      checks.push({
        attribute: 'Cleartext-Password',
        op: ':=',
        value: password,
      });
    }

    for (const item of checks) {
      await this.radCheckRepository.save({
        username,
        attribute: item.attribute,
        op: item.op,
        value: item.value,
      });
    }

    for (const item of dto.replies) {
      await this.radReplyRepository.save({
        username,
        attribute: item.attribute,
        op: item.op,
        value: item.value,
      });
    }

    return {
      username,
      password,
      message: 'PPPoE user created successfully',
    };
  }

  async changePassword(username: string, newPassword: string) {
    await this.radCheckRepository.update(
      {
        username,
        attribute: 'Cleartext-Password',
      },

      {
        value: newPassword,
      },
    );

    return true;
  }

  async updatePlan(username: string, plan: any) {
    await this.radReplyRepository.delete({
      username,
    });

    await this.radReplyRepository.save({
      username,

      attribute: 'Mikrotik-Rate-Limit',

      op: ':=',

      value: `${plan.download_speed}k/${plan.upload_speed}k`,
    });

    if (plan.simultaneous_use) {
      await this.radReplyRepository.save({
        username,

        attribute: 'Simultaneous-Use',

        op: ':=',

        value: String(plan.simultaneous_use),
      });
    }

    return true;
  }

  async disableUser(username: string) {
    await this.radCheckRepository.update(
      {
        username,
        attribute: 'Auth-Type',
      },

      {
        op: ':=',
        value: 'Reject',
      },
    );

    return true;
  }

  async deleteUser(username: string) {
    await this.radCheckRepository.delete({
      username,
    });

    await this.radReplyRepository.delete({
      username,
    });

    return true;
  }

  async getOnlineUsers() {
    return await this.radAcctRepository.find({
      where: {
        acctstoptime: IsNull(),
      },
    });
  }

  async getUserUsage(username: string) {
    const sessions = await this.radAcctRepository.find({
      where: {
        username,
      },
    });

    let download = 0;
    let upload = 0;

    sessions.forEach((session) => {
      download += Number(session.acctinputoctets || 0);

      upload += Number(session.acctoutputoctets || 0);
    });

    return {
      username,

      download_bytes: download,

      upload_bytes: upload,
    };
  }

  async createHotspotUser(dto: CreateHotspotUserDto) {
    const count = dto.count ?? 1;

    const users: HotspotUserResult[] = [];

    for (let i = 0; i < count; i++) {
      const username =
        dto.generateUsername || !dto.username
          ? this.generateVoucherUsername()
          : dto.username;

      const password = dto.password || this.generateVoucherPassword();

      const checks = [...dto.checks];

      if (!checks.some((c) => c.attribute === 'Cleartext-Password')) {
        checks.push({
          attribute: 'Cleartext-Password',
          op: ':=',
          value: password,
        });
      }

      for (const item of checks) {
        await this.radCheckRepository.save({
          username,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        });
      }

      for (const item of dto.replies) {
        await this.radReplyRepository.save({
          username,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        });
      }

      users.push({
        username,
        password,
      });

      if (!dto.generateUsername && dto.username) {
        break;
      }
    }

    return {
      count: users.length,
      users,
    };
  }

  async createGroup(dto: CreateGroupDto) {
    for (const item of dto.checks) {
      await this.groupCheckRepo.save({
        groupname: dto.name,

        attribute: item.attribute,

        op: item.op,

        value: item.value,
      });
    }

    for (const item of dto.replies) {
      await this.groupReplyRepo.save({
        groupname: dto.name,

        attribute: item.attribute,

        op: item.op,

        value: item.value,
      });
    }

    return {
      message: 'Group created successfully',
    };
  }
  async assignGroup(username: string, group: string) {
    await this.userGroupRepo.save({
      username,
      groupname: group,
      priority: 1,
    });

    return true;
  }

  async removeGroup(username: string) {
    await this.userGroupRepo.delete({
      username,
    });

    return true;
  }
  private generateVoucherUsername(length = 8): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let username = '';

    for (let i = 0; i < length; i++) {
      username += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return username;
  }

  private generateVoucherPassword(length = 6): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let password = '';

    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
  }

  getRadiusAttributes() {
    return {
      operators: Operators,

      check: RadiusCheckAttributes,

      reply: RadiusReplyAttributes,

      mikrotik: MikrotikAttributes,
    };
  }
}
