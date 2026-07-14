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
import {
  CreateGroupNetworkRadiusDto,
  CreateNetworkRadiusDto,
} from './dto/network-radius.dto';
import { ServiceType } from 'src/shared/enums/service_type.enum';
import { GroupNetworkRadius } from './entities/group-network-radius';
import { UpdateGroupDto } from './dto/update-group.dto';

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

    @InjectRepository(GroupNetworkRadius)
    private readonly groupNetworkRadiusRepo: Repository<GroupNetworkRadius>,
  ) {}

  public async createRadiusUsers(dto: CreateUserDto, isPpppoe: boolean) {
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
      let valueService;
      if (isPpppoe === true) valueService = ServiceType.PPPOE;
      else valueService = ServiceType.HOTSPOT;
      await this.createUserRadius({
        network_id: dto.network_id,
        username,
        service_type: valueService,
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

  public async getOnlineUsers() {
    return await this.radAcctRepository.find({
      where: {
        acctstoptime: IsNull(),
      },
    });
  }

  public async createGroup(dto: CreateGroupDto) {
    const groupExist = await this.groupCheckRepo.findOne({
      where: {
        groupname: dto.name,
      },
    });
    if (groupExist) {
      throw new HttpException('group already exits ', HttpStatus.BAD_REQUEST);
    }
    const checks = await this.groupCheckRepo.save(
      dto.checks.map((item) => ({
        groupname: dto.name,
        attribute: item.attribute,
        op: item.op,
        value: item.value,
      })),
    );

    const replies = await this.groupReplyRepo.save(
      dto.replies.map((item) => ({
        groupname: dto.name,
        attribute: item.attribute,
        op: item.op,
        value: item.value,
      })),
    );
    await this.createGroupNetworkRadius({
      network_id: dto.network_id,
      groupname: dto.name,
    });
    return {
      data: {
        groupname: dto.name,
        checks,
        replies,
      },
    };
  }
  public async assignGroup(username: string, group: string) {
    await this.userGroupRepo.save({
      username,
      groupname: group,
      priority: 1,
    });

    return true;
  }

  public async unassignGroup(username: string) {
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

  public getRadiusAttributes() {
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
  public async findOneUser(username: string) {
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

  public async findOneGroup(groupname: string) {
    const checks = await this.groupCheckRepo.find({
      where: { groupname },
    });

    if (!checks.length) {
      throw new NotFoundException('groupname not found');
    }

    const replies = await this.groupReplyRepo.find({
      where: { groupname },
    });

    return {
      groupname,
      checks,
      replies,
    };
  }

  public async updateUser(username: string, dto: UpdateUserDto) {
    const exists = await this.radCheckRepository.findOne({
      where: { username },
    });

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const newUsername = dto.username ?? username;

    if (newUsername !== username) {
      // التحقق من أن الاسم الجديد غير مستخدم
      const usernameExists = await this.radCheckRepository.findOne({
        where: { username: newUsername },
      });

      if (usernameExists) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const networkUser = await this.networkRadiusRepo.findOne({
        where: { username },
      });

      await Promise.all([
        this.radCheckRepository.update({ username }, { username: newUsername }),
        this.radReplyRepository.update({ username }, { username: newUsername }),
      ]);

      if (networkUser) {
        await this.networkRadiusRepo.delete({ username });

        await this.networkRadiusRepo.save({
          ...networkUser,
          username: newUsername,
        });
      }

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

  public async updateGroup(groupname: string, dto: UpdateGroupDto) {
    const exists = await this.groupCheckRepo.findOne({
      where: { groupname },
    });

    if (!exists) {
      throw new NotFoundException('Group not found');
    }

    const newGroupName = dto.groupname ?? groupname;

    if (newGroupName !== groupname) {
      const groupExists = await this.groupCheckRepo.findOne({
        where: { groupname: newGroupName },
      });

      if (groupExists) {
        throw new HttpException(
          `Group  already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const groupNetwork = await this.groupNetworkRadiusRepo.findOne({
        where: { groupname },
      });

      await Promise.all([
        this.groupCheckRepo.update({ groupname }, { groupname: newGroupName }),
        this.groupReplyRepo.update({ groupname }, { groupname: newGroupName }),
      ]);

      if (groupNetwork) {
        await this.groupNetworkRadiusRepo.delete({ groupname });

        await this.groupNetworkRadiusRepo.save({
          ...groupNetwork,
          groupname: newGroupName,
        });
      }

      groupname = newGroupName;
    }

    if (dto.checks) {
      await this.groupCheckRepo.delete({ groupname });

      await this.groupCheckRepo.save(
        dto.checks.map((item) => ({
          groupname,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        })),
      );
    }

    if (dto.replies) {
      await this.groupReplyRepo.delete({ groupname });

      await this.groupReplyRepo.save(
        dto.replies.map((item) => ({
          groupname,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        })),
      );
    }

    const [radgroupcheck, radgroupreply] = await Promise.all([
      this.groupCheckRepo.find({
        where: { groupname },
      }),
      this.groupReplyRepo.find({
        where: { groupname },
      }),
    ]);

    return {
      groupname,
      radgroupcheck,
      radgroupreply,
    };
  }
  public async removeUser(username: string) {
    const exists = await this.radCheckRepository.findOne({
      where: { username },
    });

    if (!exists) {
      throw new NotFoundException('User not found');
    }
    await this.removeUserRadius(exists.username);
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

  public async createGroupNetworkRadius(dto: CreateGroupNetworkRadiusDto) {
    const groupNetworkRadius = this.groupNetworkRadiusRepo.create(dto);
    return await this.groupNetworkRadiusRepo.save(groupNetworkRadius);
  }

  public async removeUserRadius(username: string) {
    return await this.networkRadiusRepo.delete({ username });
  }

  public async removeGroupRadius(groupname: string) {
    return await this.groupNetworkRadiusRepo.delete({ groupname });
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

    for (const networkUser of result.items) {
      users[networkUser.username] = {
        username: networkUser.username,
        service_type: networkUser.service_type,
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

  public async findAllGroupNetwork(filter: FindAllUserDto) {
    const query = this.groupNetworkRadiusRepo
      .createQueryBuilder('group_network_radius')
      .where('true');

    generateQuerySorts(
      query,
      filter,
      GroupNetworkRadius,
      'group_network_radius',
    );
    generateQueryConditions(query, filter, 'group_network_radius');

    const result = await customPaginate(query, {
      page: filter.pagination.page,
      limit: filter.pagination.limit,
    });

    const groupNames = result.items.map((x) => x.groupname);

    if (!groupNames.length) {
      return {
        ...result,
        items: [],
      };
    }

    const checks = await this.groupCheckRepo.find({
      where: {
        groupname: In(groupNames),
      },
      order: {
        groupname: 'ASC',
      },
    });

    const replies = await this.groupReplyRepo.find({
      where: {
        groupname: In(groupNames),
      },
    });

    const groups = {};

    for (const groupNetwork of result.items) {
      groups[groupNetwork.groupname] = {
        groupname: groupNetwork.groupname,
        checks: [],
        replies: [],
      };
    }

    for (const check of checks) {
      groups[check.groupname]?.checks.push({
        attribute: check.attribute,
        op: check.op,
        value: check.value,
      });
    }

    for (const reply of replies) {
      groups[reply.groupname]?.replies.push({
        attribute: reply.attribute,
        op: reply.op,
        value: reply.value,
      });
    }

    return {
      ...result,
      items: groupNames.map((groupname) => groups[groupname]),
    };
  }

  public async removeGroup(groupname: string) {
    const exists = await this.groupCheckRepo.findOne({
      where: { groupname },
    });

    if (!exists) {
      throw new NotFoundException('User not found');
    }
    await this.removeGroupRadius(exists.groupname);
    await this.groupCheckRepo.delete({ groupname });
    await this.groupReplyRepo.delete({ groupname });

    return {
      done: true,
    };
  }
}
