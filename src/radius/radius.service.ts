import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';

import { RadCheck } from './entities/ radcheck.entity';
import { RadReply } from './entities/radreply.entity';
import { RadAcct } from './entities/radacct.entity';
import { RadGroupCheck } from './entities/radgroupcheck.entity';
import { RadGroupReply } from './entities/radgroupreply.entity';
import { RadUserGroup } from './entities/radusergroup.entity';
import { CreateUserDto, HotspotUserResult } from './dto/create-user.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  MikrotikAttributes,
  Operators,
  RadiusCheckAttributes,
  RadiusReplyAttributes,
} from './constants/radius-attributes';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  customPaginate,
  generateQueryConditions,
  generateQuerySorts,
} from 'src/shared/helpers';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { NetworkRadius } from './entities/network-radius.entity';
import { CreateNetworkRadiusDto } from './dto/network-radius.dto';

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
    @InjectRepository(NetworkRadius)
    private readonly networkRadiusRepo: Repository<NetworkRadius>,
  ) {}

  // async createPppoeUser(dto: CreateUserDto) {
  //   const username =
  //     dto.generateUsername || !dto.username
  //       ? this.generateVoucherUsername()
  //       : dto.username;

  //   const password = dto.password || this.generateVoucherPassword();

  //   const checks = [...dto.checks];

  //   // إضافة كلمة المرور إذا لم تكن موجودة
  //   if (!checks.some((c) => c.attribute === 'Cleartext-Password')) {
  //     checks.push({
  //       attribute: 'Cleartext-Password',
  //       op: ':=',
  //       value: password,
  //     });
  //   }

  //   for (const item of checks) {
  //     await this.radCheckRepository.save({
  //       username,
  //       attribute: item.attribute,
  //       op: item.op,
  //       value: item.value,
  //     });
  //   }

  //   for (const item of dto.replies) {
  //     await this.radReplyRepository.save({
  //       username,
  //       attribute: item.attribute,
  //       op: item.op,
  //       value: item.value,
  //     });
  //   }

  //   return {
  //     username,
  //     password,
  //   };
  // }

  public async createRadiusUsers(dto: CreateUserDto) {
    const count = dto.generateUsername || dto.count ? (dto.count ?? 1) : 1;

    const users: HotspotUserResult[] = [];

    for (let i = 0; i < count; i++) {
      let username: string;

      if (dto.generateUsername || !dto.username) {
        // توليد اسم مستخدم غير مستخدم
        do {
          username = this.generateVoucherUsername();
        } while (await this.usernameExists(username));
      } else {
        username = dto.username;

        // التحقق من اسم المستخدم المدخل
        if (await this.usernameExists(username)) {
          throw new HttpException(
            `Username '${username}' already exists`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const password = dto.password || this.generateVoucherPassword();

      const checks = [...dto.checks];

      if (!checks.some((c) => c.attribute === 'Cleartext-Password')) {
        checks.push({
          attribute: 'Cleartext-Password',
          op: ':=',
          value: password,
        });
      }

      await this.radCheckRepository.save(
        checks.map((item) => ({
          username,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        })),
      );

      await this.radReplyRepository.save(
        dto.replies.map((item) => ({
          username,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        })),
      );

      await this.createUserRadius({
        network_id: dto.network_id,
        username,
      });
      users.push({
        username,
        password,
      });

      if (!dto.generateUsername && dto.username) {
        break;
      }
    }

    return users;
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

  // async createHotspotUser(dto: CreateUserDto) {
  //   const count = dto.count ?? 1;

  //   const users: HotspotUserResult[] = [];

  //   for (let i = 0; i < count; i++) {
  //     const username =
  //       dto.generateUsername || !dto.username
  //         ? this.generateVoucherUsername()
  //         : dto.username;

  //     const password = dto.password || this.generateVoucherPassword();

  //     const checks = [...dto.checks];

  //     if (!checks.some((c) => c.attribute === 'Cleartext-Password')) {
  //       checks.push({
  //         attribute: 'Cleartext-Password',
  //         op: ':=',
  //         value: password,
  //       });
  //     }

  //     for (const item of checks) {
  //       await this.radCheckRepository.save({
  //         username,
  //         attribute: item.attribute,
  //         op: item.op,
  //         value: item.value,
  //       });
  //     }

  //     for (const item of dto.replies) {
  //       await this.radReplyRepository.save({
  //         username,
  //         attribute: item.attribute,
  //         op: item.op,
  //         value: item.value,
  //       });
  //     }

  //     users.push({
  //       username,
  //       password,
  //     });

  //     if (!dto.generateUsername && dto.username) {
  //       break;
  //     }
  //   }

  //   return {
  //     count: users.length,
  //     users,
  //   };
  // }

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

  public async findAll(filter: FindAllUserDto) {
    const query = this.radCheckRepository
      .createQueryBuilder('radcheck')
      .where('true');

    generateQuerySorts(query, filter, RadCheck, 'radcheck');
    generateQueryConditions(query, filter, 'radcheck');

    const result = await customPaginate(query, {
      page: filter.pagination.page,
      limit: filter.pagination.limit,
    });

    const usernames = result.items.map((x) => x.username);

    if (!usernames.length) {
      return {
        ...result,
        data: [],
      };
    }

    const checks = await this.radCheckRepository.find({
      where: {
        username: In(usernames),
      },
      order: {
        username: 'ASC',
      },
    });

    const replies = await this.radReplyRepository.find({
      where: {
        username: In(usernames),
      },
    });

    const users = {};

    for (const username of usernames) {
      users[username] = {
        username,
        checks: [],
        replies: [],
      };
    }

    for (const check of checks) {
      users[check.username].checks.push({
        attribute: check.attribute,
        op: check.op,
        value: check.value,
      });
    }

    for (const reply of replies) {
      users[reply.username].replies.push({
        attribute: reply.attribute,
        op: reply.op,
        value: reply.value,
      });
    }

    const response = {
      ...result,
    };

    response.items = usernames.map((username) => users[username]);

    return response;
  }
  async findOne(username: string) {
    const checks = await this.radCheckRepository.find({
      where: { username },
    });

    if (!checks.length) {
      throw new NotFoundException('User not found');
    }

    const replies = await this.radReplyRepository.find({
      where: { username },
    });

    return {
      username,
      checks,
      replies,
    };
  }

  async update(username: string, dto: UpdateUserDto) {
    const exists = await this.radCheckRepository.findOne({
      where: { username },
    });

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const newUsername = dto.username ?? username;

    if (newUsername !== username) {
      await Promise.all([
        this.radCheckRepository.update({ username }, { username: newUsername }),
        this.radReplyRepository.update({ username }, { username: newUsername }),
      ]);

      username = newUsername;
    }

    if (dto.checks) {
      await this.radCheckRepository.delete({ username });

      const checks = [...dto.checks];

      if (
        dto.password &&
        !checks.some((c) => c.attribute === 'Cleartext-Password')
      ) {
        checks.push({
          attribute: 'Cleartext-Password',
          op: ':=',
          value: dto.password,
        });
      }

      await this.radCheckRepository.save(
        checks.map((item) => ({
          username,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        })),
      );
    } else if (dto.password) {
      // تحديث كلمة المرور فقط
      await this.radCheckRepository.update(
        {
          username,
          attribute: 'Cleartext-Password',
        },
        {
          value: dto.password,
        },
      );
    }

    // تحديث radreply
    if (dto.replies) {
      await this.radReplyRepository.delete({ username });

      await this.radReplyRepository.save(
        dto.replies.map((item) => ({
          username,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        })),
      );
    }

    const [radcheck, radreply] = await Promise.all([
      this.radCheckRepository.find({
        where: { username },
      }),
      this.radReplyRepository.find({
        where: { username },
      }),
    ]);

    return {
      username,
      radcheck,
      radreply,
    };
  }

  async remove(username: string) {
    const exists = await this.radCheckRepository.findOne({
      where: { username },
    });

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    await this.radCheckRepository.delete({ username });
    await this.radReplyRepository.delete({ username });

    return {
      done: true,
    };
  }

  private async usernameExists(username: string): Promise<boolean> {
    return this.radCheckRepository.exists({
      where: { username },
    });
  }

  public async createUserRadius(dto: CreateNetworkRadiusDto) {
    const userRadius = this.networkRadiusRepo.create(dto);
    return await this.networkRadiusRepo.save(userRadius);
  }

  public async findAllUserNetwork(filter: FindAllUserDto) {
    const query = this.networkRadiusRepo
      .createQueryBuilder('network_user')
      .where('true');

    generateQuerySorts(query, filter, NetworkRadius, 'network_user');
    generateQueryConditions(query, filter, 'network_user');

    const result = await customPaginate(query, {
      page: filter.pagination.page,
      limit: filter.pagination.limit,
    });

    const usernames = result.items.map((x) => x.username);

    if (!usernames.length) {
      return {
        ...result,
        data: [],
      };
    }

    const checks = await this.radCheckRepository.find({
      where: {
        username: In(usernames),
      },
      order: {
        username: 'ASC',
      },
    });

    const replies = await this.radReplyRepository.find({
      where: {
        username: In(usernames),
      },
    });

    const users = {};

    for (const username of usernames) {
      users[username] = {
        username,
        checks: [],
        replies: [],
      };
    }

    for (const check of checks) {
      users[check.username].checks.push({
        attribute: check.attribute,
        op: check.op,
        value: check.value,
      });
    }

    for (const reply of replies) {
      users[reply.username].replies.push({
        attribute: reply.attribute,
        op: reply.op,
        value: reply.value,
      });
    }

    const response = {
      ...result,
    };

    response.items = usernames.map((username) => users[username]);

    return response;
  }
}
