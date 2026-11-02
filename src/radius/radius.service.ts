import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  IsNull,
  Repository,
} from 'typeorm';

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
import { FindAllUserRadiusDto } from './dto/find-all-user.dto';
import { NetworkRadius } from './entities/network-radius.entity';
import {
  CreateGroupNetworkRadiusDto,
  CreateNetworkRadiusDto,
} from './dto/network-radius.dto';
import { ServiceType } from 'src/shared/enums/service_type.enum';
import { GroupNetworkRadius } from './entities/group-network-radius';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Nas } from './entities/nas.entity';
import { CreateNasDto } from './dto/create-nas.dto';
import { UpdateNasDto } from './dto/update-nas.dto';
import { FindAllNasDto } from './dto/find-all-nas.dto';
import { PaginationMetadata } from 'src/shared/pagination-metadata';
import { spawn } from 'child_process';
import { RouterOSAPI } from 'node-routeros';

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
    private readonly dataSource: DataSource,

    @InjectRepository(RadGroupReply)
    private readonly groupReplyRepo: Repository<RadGroupReply>,

    @InjectRepository(RadUserGroup)
    private readonly userGroupRepo: Repository<RadUserGroup>,
    @InjectRepository(NetworkRadius)
    private readonly networkRadiusRepo: Repository<NetworkRadius>,

    @InjectRepository(Nas)
    private readonly nasRepository: Repository<Nas>,

    @InjectRepository(RadUserGroup)
    private readonly radUserGroupRepository: Repository<RadUserGroup>,

    @InjectRepository(GroupNetworkRadius)
    private readonly groupNetworkRadiusRepo: Repository<GroupNetworkRadius>,
  ) {}

  // public async createRadiusUsers(dto: CreateUserDto, isPpppoe: boolean) {
  //   const count = dto.generateUsername || dto.count ? (dto.count ?? 1) : 1;

  //   const users: HotspotUserResult[] = [];

  //   for (let i = 0; i < count; i++) {
  //     let username: string;

  //     if (dto.generateUsername || !dto.username) {
  //       do {
  //         username = this.generateVoucherUsername();
  //       } while (await this.usernameExists(username));
  //     } else {
  //       username = dto.username;

  //       if (await this.usernameExists(username)) {
  //         throw new HttpException(
  //           `Username '${username}' already exists`,
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //     }

  //     const password = dto.password || this.generateVoucherPassword();

  //     const checks = [...dto.checks];

  //     if (!checks.some((c) => c.attribute === 'Cleartext-Password')) {
  //       checks.push({
  //         attribute: 'Cleartext-Password',
  //         op: ':=',
  //         value: password,
  //       });
  //     }

  //     await this.radCheckRepository.save(
  //       checks.map((item) => ({
  //         username,
  //         attribute: item.attribute,
  //         op: item.op,
  //         value: item.value,
  //       })),
  //     );

  //     await this.radReplyRepository.save(
  //       dto.replies.map((item) => ({
  //         username,
  //         attribute: item.attribute,
  //         op: item.op,
  //         value: item.value,
  //       })),
  //     );
  //     let valueService;
  //     if (isPpppoe === true) valueService = ServiceType.PPPOE;
  //     else valueService = ServiceType.HOTSPOT;
  //     await this.createUserRadius({
  //       network_id: dto.network_id,
  //       username,
  //       service_type: valueService,
  //     });
  //     if (dto.groupname) await this.assignGroup(username, dto.groupname);
  //     users.push({
  //       username,
  //       password,
  //     });

  //     if (!dto.generateUsername && dto.username) {
  //       break;
  //     }
  //   }

  //   return users;
  // }

  private isDuplicateKeyError(error: any): boolean {
    return error?.code === 'ER_DUP_ENTRY' || error?.errno === 1062;
  }
  private generateUniqueUsernames(count: number): Set<string> {
    const usernames = new Set<string>();
    const maxAttempts = Math.max(100, count * 20);
    let attempts = 0;

    while (usernames.size < count && attempts < maxAttempts) {
      attempts++;

      const username = this.generateVoucherUsername();

      if (username) {
        usernames.add(username);
      }
    }

    if (usernames.size !== count) {
      throw new HttpException(
        'Unable to generate enough unique usernames. Please try again.',
        HttpStatus.CONFLICT,
      );
    }

    return usernames;
  }
  private readonly insertBatchSize = 250;

  private async insertInChunks<T extends object>(
    repo: Repository<T>,
    rows: T[],
  ): Promise<void> {
    for (let i = 0; i < rows.length; i += this.insertBatchSize) {
      const batch = rows.slice(i, i + this.insertBatchSize);

      if (batch.length === 0) continue;

      await repo.insert(batch);
    }
  }

  private async findExistingUsernames(
    usernames: string[],
  ): Promise<Set<string>> {
    const existing = new Set<string>();

    // تقسيم البحث أيضًا لتجنّب قوائم IN الضخمة.
    for (let i = 0; i < usernames.length; i += 500) {
      const batch = usernames.slice(i, i + 500);

      const rows = await this.networkRadiusRepo.find({
        where: {
          username: In(batch),
        },
        select: {
          username: true,
        },
      });

      for (const row of rows) {
        existing.add(row.username);
      }
    }

    return existing;
  }

  public async createRadiusUsers(
    dto: CreateUserDto,
    isPpppoe: boolean,
  ): Promise<HotspotUserResult[]> {
    const count = dto.generateUsername || dto.count ? (dto.count ?? 1) : 1;

    if (!Number.isSafeInteger(count) || count < 1) {
      throw new HttpException(
        'Count must be a positive integer',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (count > 2000) {
      throw new HttpException(
        'Maximum 2000 users per request',
        HttpStatus.BAD_REQUEST,
      );
    }

    const serviceType = isPpppoe ? ServiceType.PPPOE : ServiceType.HOTSPOT;

    const maxCollisionRetries = 10;

    let generatedNames = new Set<string>();

    if (!dto.generateUsername && dto.username) {
      generatedNames = new Set([dto.username]);

      const existing = await this.findExistingUsernames([dto.username]);

      if (existing.has(dto.username)) {
        throw new HttpException(
          `Username '${dto.username}' already exists`,
          HttpStatus.CONFLICT,
        );
      }
    } else {
      let found = false;

      for (let attempt = 0; attempt < maxCollisionRetries; attempt++) {
        const candidates = this.generateUniqueUsernames(count);

        const existing = await this.findExistingUsernames([...candidates]);

        if (existing.size === 0) {
          generatedNames = candidates;
          found = true;
          break;
        }
      }

      if (!found) {
        throw new HttpException(
          'Could not generate available usernames. Please try again.',
          HttpStatus.CONFLICT,
        );
      }
    }

    // تجهيز البيانات في الذاكرة، بدون عمليات حفظ داخل الحلقة.
    const users: HotspotUserResult[] = [];
    const allChecks: {
      username: string;
      attribute: string;
      op: string;
      value: string;
    }[] = [];

    const allReplies: {
      username: string;
      attribute: string;
      op: string;
      value: string;
    }[] = [];

    const allRadiusUsers: {
      network_id: CreateUserDto['network_id'];
      username: string;
      service_type: ServiceType;
    }[] = [];

    const allGroups: {
      username: string;
      groupname: string;
      priority: number;
    }[] = [];

    for (const username of generatedNames) {
      const checks = [...(dto.checks ?? [])];

      const passwordCheck = checks.find(
        (item) => item.attribute === 'Cleartext-Password',
      );

      const password =
        passwordCheck?.value ?? dto.password ?? this.generateVoucherPassword();

      if (passwordCheck) {
        // القيمة المحفوظة هي نفسها التي سترجعها الـ API.
        passwordCheck.value = password;
        passwordCheck.op = ':=';
      } else {
        checks.push({
          attribute: 'Cleartext-Password',
          op: ':=',
          value: password,
        });
      }

      for (const item of checks) {
        allChecks.push({
          username,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        });
      }

      for (const item of dto.replies) {
        allReplies.push({
          username,
          attribute: item.attribute,
          op: item.op,
          value: item.value,
        });
      }

      allRadiusUsers.push({
        network_id: dto.network_id,
        username,
        service_type: serviceType,
      });

      if (dto.groupname) {
        allGroups.push({
          username,
          groupname: dto.groupname,
          priority: 1,
        });
      }

      users.push({ username, password });
    }

    // الإدخال الجماعي داخل Transaction واحدة.
    try {
      await this.dataSource.transaction(async (manager) => {
        const checksRepo = manager.getRepository(
          this.radCheckRepository.target,
        );
        const repliesRepo = manager.getRepository(
          this.radReplyRepository.target,
        );
        const radiusRepo = manager.getRepository(this.networkRadiusRepo.target);
        const groupsRepo = manager.getRepository(this.userGroupRepo.target);

        await this.insertInChunks(checksRepo, allChecks);

        if (allReplies.length > 0) {
          await this.insertInChunks(repliesRepo, allReplies);
        }

        await this.insertInChunks(radiusRepo, allRadiusUsers);

        if (allGroups.length > 0) {
          await this.insertInChunks(groupsRepo, allGroups);
        }
      });

      return users;
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new HttpException(
          'A username already exists. No records from this transaction were committed.',
          HttpStatus.CONFLICT,
        );
      }

      throw error;
    }
  }

  public async getOnlineUsers(): Promise<RadAcct[]> {
    const limit = 200;
    let page = 1;

    const allUsers: RadAcct[] = [];

    while (true) {
      const skip = (page - 1) * limit;

      const users = await this.radAcctRepository
        .createQueryBuilder('radAcct')
        .where('radAcct.acctstoptime IS NULL')
        .orderBy('radAcct.acctstarttime', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      allUsers.push(...users);

      if (users.length < limit) {
        break;
      }

      page++;
    }

    return allUsers;
  }
  public async getSessionsByUsername(username: string): Promise<RadAcct[]> {
    return await this.radAcctRepository
      .createQueryBuilder('radAcct')
      .where('radAcct.username = :username', { username })
      .orderBy('radAcct.acctstarttime', 'DESC')
      .getMany();
  }
  public async createGroup(dto: CreateGroupDto) {
    const groupExist = await this.groupCheckRepo.findOne({
      where: {
        groupname: dto.groupname,
      },
    });
    if (groupExist) {
      throw new HttpException('group already exits ', HttpStatus.BAD_REQUEST);
    }
    const checks = await this.groupCheckRepo.save(
      dto.checks.map((item) => ({
        groupname: dto.groupname,
        attribute: item.attribute,
        op: item.op,
        value: item.value,
      })),
    );

    const replies = await this.groupReplyRepo.save(
      dto.replies.map((item) => ({
        groupname: dto.groupname,
        attribute: item.attribute,
        op: item.op,
        value: item.value,
      })),
    );
    await this.createGroupNetworkRadius({
      network_id: dto.network_id,
      groupname: dto.groupname,
    });
    return {
      data: {
        groupname: dto.groupname,
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

  public async findAll(filter: FindAllUserRadiusDto) {
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
    const userNetwork = await this.networkRadiusRepo.findOne({
      where: { username },
      relations: { network: true },
    });
    const groupUser = await this.radUserGroupRepository.findOne({
      where: { username },
    });
    const replies = await this.radReplyRepository.find({
      where: { username },
    });

    return {
      groupUser: groupUser?.groupname,
      network: userNetwork?.network,
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
    const groupNetworkRadius = await this.groupNetworkRadiusRepo.findOne({
      where: { groupname },
      relations: { network: true },
    });
    const replies = await this.groupReplyRepo.find({
      where: { groupname },
    });

    return {
      network: groupNetworkRadius?.network,
      groupname,
      checks,
      replies,
    };
  }

  // public async updateUser(username: string, dto: UpdateUserDto) {
  //   const exists = await this.radCheckRepository.findOne({
  //     where: { username },
  //   });

  //   if (!exists) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const newUsername = dto.username ?? username;

  //   if (newUsername !== username) {
  //     const usernameExists = await this.radCheckRepository.findOne({
  //       where: { username: newUsername },
  //     });

  //     if (usernameExists) {
  //       throw new HttpException(
  //         'Username already exists',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const networkUser = await this.networkRadiusRepo.findOne({
  //       where: { username },
  //     });

  //     await Promise.all([
  //       this.radCheckRepository.update({ username }, { username: newUsername }),
  //       this.radReplyRepository.update({ username }, { username: newUsername }),
  //     ]);

  //     if (networkUser) {
  //       await this.networkRadiusRepo.delete({
  //         username,
  //       });

  //       await this.networkRadiusRepo.save({
  //         ...networkUser,
  //         username: newUsername,
  //         network_id:
  //           dto.network_id !== undefined
  //             ? dto.network_id
  //             : networkUser.network_id,
  //       });
  //     }

  //     username = newUsername;
  //   }

  //   if (dto.network_id !== undefined) {
  //     await this.networkRadiusRepo.update(
  //       { username },
  //       {
  //         network_id: dto.network_id,
  //       },
  //     );
  //   }
  //   const currentGroup = await this.radUserGroupRepository.findOne({
  //     where: {
  //       username: dto.username,
  //     },
  //   });
  //   if (dto.groupname !== undefined) {
  //     if (
  //       dto.username &&
  //       currentGroup &&
  //       currentGroup.groupname !== dto.groupname
  //     ) {
  //       await this.unassignGroup(dto.username);

  //       await this.assignGroup(dto.username, dto.groupname);
  //     }
  //   }

  //   if (dto.checks) {
  //     await this.radCheckRepository.delete({ username });

  //     const checks = [...dto.checks];

  //     if (
  //       dto.password &&
  //       !checks.some((c) => c.attribute === 'Cleartext-Password')
  //     ) {
  //       checks.push({
  //         attribute: 'Cleartext-Password',
  //         op: ':=',
  //         value: dto.password,
  //       });
  //     }

  //     await this.radCheckRepository.save(
  //       checks.map((item) => ({
  //         username,
  //         attribute: item.attribute,
  //         op: item.op,
  //         value: item.value,
  //       })),
  //     );
  //   } else if (dto.password) {
  //     await this.radCheckRepository.update(
  //       {
  //         username,
  //         attribute: 'Cleartext-Password',
  //       },
  //       {
  //         value: dto.password,
  //       },
  //     );
  //   }

  //   if (dto.replies) {
  //     await this.radReplyRepository.delete({ username });

  //     await this.radReplyRepository.save(
  //       dto.replies.map((item) => ({
  //         username,
  //         attribute: item.attribute,
  //         op: item.op,
  //         value: item.value,
  //       })),
  //     );
  //   }

  //   const [radcheck, radreply] = await Promise.all([
  //     this.radCheckRepository.find({
  //       where: { username },
  //     }),
  //     this.radReplyRepository.find({
  //       where: { username },
  //     }),
  //   ]);

  //   return {
  //     username,
  //     radcheck,
  //     radreply,
  //   };
  // }

  public async updateUser(username: string, dto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const radCheckRepo = queryRunner.manager.getRepository(RadCheck);

      const radReplyRepo = queryRunner.manager.getRepository(RadReply);

      const networkRadiusRepo =
        queryRunner.manager.getRepository(NetworkRadius);

      const radUserGroupRepo = queryRunner.manager.getRepository(RadUserGroup);

      // 1. Verify that the user exists.
      const exists = await radCheckRepo.findOne({
        where: { username },
      });

      if (!exists) {
        throw new NotFoundException('User not found');
      }

      const oldUsername = username;
      const newUsername = dto.username ?? oldUsername;

      // 2. Handle username changes.
      if (newUsername !== oldUsername) {
        const usernameExists = await radCheckRepo.findOne({
          where: { username: newUsername },
        });

        if (usernameExists) {
          throw new BadRequestException('Username already exists');
        }

        // Check the unique NetworkRadius username as well.
        const networkUsernameExists = await networkRadiusRepo.findOne({
          where: { username: newUsername },
        });

        if (networkUsernameExists) {
          throw new BadRequestException(
            'Username already exists in network radius',
          );
        }

        // Update all related tables within the same transaction.
        await radCheckRepo.update(
          { username: oldUsername },
          { username: newUsername },
        );

        await radReplyRepo.update(
          { username: oldUsername },
          { username: newUsername },
        );

        await radUserGroupRepo.update(
          { username: oldUsername },
          { username: newUsername },
        );

        const networkUpdate: Partial<NetworkRadius> = {
          username: newUsername,
        };

        if (dto.network_id !== undefined) {
          networkUpdate.network_id = dto.network_id;
        }

        // Update the existing row instead of deleting and recreating it.
        await networkRadiusRepo.update(
          { username: oldUsername },
          networkUpdate,
        );

        username = newUsername;
      } else if (dto.network_id !== undefined) {
        // 3. Update the network without changing the username.
        await networkRadiusRepo.update(
          { username },
          { network_id: dto.network_id },
        );
      }

      // 4. Update the user's group if requested.
      if (dto.groupname !== undefined) {
        const currentGroup = await radUserGroupRepo.findOne({
          where: { username },
        });

        if (currentGroup) {
          if (currentGroup.groupname !== dto.groupname) {
            await radUserGroupRepo.update(
              { username },
              { groupname: dto.groupname },
            );
          }
        } else {
          await radUserGroupRepo.save({
            username,
            groupname: dto.groupname,
            priority: 1,
          } as any);
        }
      }

      // 5. Replace checks if supplied.
      if (dto.checks !== undefined) {
        await radCheckRepo.delete({ username });

        const checks = [...dto.checks];

        if (
          dto.password !== undefined &&
          !checks.some((check) => check.attribute === 'Cleartext-Password')
        ) {
          checks.push({
            attribute: 'Cleartext-Password',
            op: ':=',
            value: dto.password,
          });
        }

        if (checks.length > 0) {
          await radCheckRepo.save(
            checks.map((item) => ({
              username,
              attribute: item.attribute,
              op: item.op,
              value: item.value,
            })),
          );
        }
      } else if (dto.password !== undefined) {
        // 6. Update the password, or insert it if missing.
        const passwordResult = await radCheckRepo.update(
          {
            username,
            attribute: 'Cleartext-Password',
          },
          {
            value: dto.password,
          },
        );

        if (!passwordResult.affected) {
          await radCheckRepo.save({
            username,
            attribute: 'Cleartext-Password',
            op: ':=',
            value: dto.password,
          });
        }
      }

      // 7. Replace replies if supplied.
      if (dto.replies !== undefined) {
        await radReplyRepo.delete({ username });

        if (dto.replies.length > 0) {
          await radReplyRepo.save(
            dto.replies.map((item) => ({
              username,
              attribute: item.attribute,
              op: item.op,
              value: item.value,
            })),
          );
        }
      }

      // 8. Read the final state before committing.
      const [radcheck, radreply] = await Promise.all([
        radCheckRepo.find({
          where: { username },
        }),

        radReplyRepo.find({
          where: { username },
        }),
      ]);

      await queryRunner.commitTransaction();

      return {
        username,
        radcheck,
        radreply,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
        await this.groupNetworkRadiusRepo.delete({
          groupname,
        });

        await this.groupNetworkRadiusRepo.save({
          ...groupNetwork,
          groupname: newGroupName,
          network_id:
            dto.network_id !== undefined
              ? dto.network_id
              : groupNetwork.network_id,
        });
      }

      groupname = newGroupName;
    }

    if (dto.network_id !== undefined) {
      await this.groupNetworkRadiusRepo.update(
        { groupname },
        {
          network_id: dto.network_id,
        },
      );
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

  public async findAllUserNetwork(filter: FindAllUserRadiusDto) {
    const query = this.networkRadiusRepo
      .createQueryBuilder('network_radius')
      .leftJoinAndSelect('network_radius.network', 'network')

      .where('true');

    generateQuerySorts(query, filter, NetworkRadius, 'network_radius');
    generateQueryConditions(query, filter, 'network_radius');

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
        network: networkUser.network,
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

  public async findAllGroupNetwork(filter: FindAllUserRadiusDto) {
    const query = this.groupNetworkRadiusRepo
      .createQueryBuilder('group_network_radius')
      .leftJoinAndSelect('group_network_radius.network', 'network')
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
        network: groupNetwork.network,
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

  public async createNas(createNasDto: CreateNasDto) {
    const exists = await this.nasRepository.findOne({
      where: { nasname: createNasDto.nasname },
    });

    if (exists) {
      throw new HttpException('NAS already exists', HttpStatus.BAD_REQUEST);
    }

    const nas = this.nasRepository.create({
      ...createNasDto,
      type: createNasDto.type ?? 'other',
    });

    return await this.nasRepository.save(nas);
  }

  public async updateNas(id: number, updateNasDto: UpdateNasDto) {
    if (Object.keys(updateNasDto).length === 0) {
      return this.findOneNas({ id });
    }
    const currentNas = await this.findOneNas({ id });

    if (!currentNas) {
      throw new HttpException('nas not found', HttpStatus.NOT_FOUND);
    }
    if (updateNasDto.nasname && updateNasDto.nasname !== currentNas.nasname) {
      const nas = await this.findOneNas({
        nasname: updateNasDto.nasname,
      });

      if (nas) {
        throw new HttpException('nas already exist', HttpStatus.BAD_REQUEST);
      }
    }
    await this.nasRepository.update(id, updateNasDto);

    return await this.findOneNas({
      id,
    });
  }

  public findOneNas(
    nasOptions: FindOptionsWhere<Nas>,
    options?: {
      selected?: FindOptionsSelect<Nas>;
      relations?: FindOptionsRelations<Nas>;
    },
  ) {
    return this.nasRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: nasOptions,
    });
  }

  public async findAllNas(filter: FindAllNasDto) {
    const query = this.nasRepository.createQueryBuilder('nas').where('true');

    generateQuerySorts(query, filter, Nas, 'nas');
    generateQueryConditions(query, filter, 'nas');

    return await customPaginate(query, {
      page: filter.pagination.page,
      limit: filter.pagination.limit,
    });
  }

  public async removeNas(id: number) {
    const exists = await this.nasRepository.findOne({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('NAS not found');
    }

    await this.nasRepository.delete({ id });

    return {
      done: true,
    };
  }

  public async disconnectUser(username: string) {
    if (!username?.trim()) {
      throw new BadRequestException('Username is required');
    }

    // 1. منع المستخدم من المصادقة مجدداً
    const rejectRules = await this.radCheckRepository.find({
      where: {
        username,
        attribute: 'Auth-Type',
      },
    });

    if (rejectRules.length > 0) {
      for (const rule of rejectRules) {
        rule.op = ':=';
        rule.value = 'Reject';
      }

      await this.radCheckRepository.save(rejectRules);
    } else {
      await this.radCheckRepository.save(
        this.radCheckRepository.create({
          username,
          attribute: 'Auth-Type',
          op: ':=',
          value: 'Reject',
        }),
      );
    }

    // 2. جلب الجلسات النشطة فقط

    const result = await this.disconnectHotspotUser(username);

    return {
      success: result.disconnected,
      blocked: true,
      username,
      activeSessionsFound: result.activeSessionsFound,
      disconnectedSessions: result.disconnectedSessions,
      message: result.disconnected
        ? 'User blocked and Hotspot sessions disconnected'
        : 'User blocked, but an active session remains',
    };
  }

  async unblockUser(username: string) {
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('radcheck')
      .where('username = :username', { username })
      .andWhere('attribute = :attribute', {
        attribute: 'Auth-Type',
      })
      .andWhere('op = :operator', {
        operator: ':=',
      })
      .andWhere('value = :value', {
        value: 'Reject',
      })
      .execute();

    if (!result.affected) {
      throw new NotFoundException(`No block rule found for user ${username}`);
    }

    return {
      success: true,
      unblocked: true,
      username,
      deletedRules: result.affected,
      message: 'User unblocked successfully',
    };
  }

  // private sendDisconnectRequest(
  //   username: string,
  //   nasIpAddress: string,
  //   sessionId: string,
  //   secret: string,
  // ): Promise<boolean> {
  //   if (
  //     /[\r\n]/.test(username) ||
  //     /[\r\n]/.test(sessionId) ||
  //     /[\r\n]/.test(nasIpAddress)
  //   ) {
  //     throw new BadRequestException('Invalid RADIUS attributes');
  //   }

  //   // Escape strings for radclient input
  //   const escapeRadiusValue = (value: string) =>
  //     value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  //   return new Promise((resolve, reject) => {
  //     const client = spawn(
  //       'radclient',
  //       ['-x', `${nasIpAddress}:3799`, 'disconnect', secret],
  //       { stdio: ['pipe', 'pipe', 'pipe'] },
  //     );

  //     let output = '';
  //     let settled = false;

  //     const finish = (error?: Error, result = false) => {
  //       if (settled) return;
  //       settled = true;
  //       clearTimeout(timeout);

  //       if (error) reject(error);
  //       else resolve(result);
  //     };

  //     const timeout = setTimeout(() => {
  //       client.kill();
  //       finish(new Error(`Disconnect request timed out for ${nasIpAddress}`));
  //     }, 5000);

  //     client.stdout.on('data', (data) => {
  //       output += data.toString();
  //     });

  //     client.stderr.on('data', (data) => {
  //       output += data.toString();
  //     });

  //     client.on('error', (error) => {
  //       finish(error);
  //     });
  //     client.on('close', (code) => {
  //       console.log('[RADIUS Disconnect] NAS:', nasIpAddress);
  //       console.log('[RADIUS Disconnect] Exit code:', code);
  //       console.log('[RADIUS Disconnect] Output:', output);

  //       finish(undefined, /Disconnect-ACK/i.test(output));
  //     });

  //     client.stdin.end(
  //       `User-Name = "${escapeRadiusValue(username)}"\n` +
  //         `Acct-Session-Id = "${escapeRadiusValue(sessionId)}"\n`,
  //     );
  //   });
  // }

  private async disconnectHotspotUser(username: string) {
    const host = process.env.MIKROTIK_HOST;
    const user = process.env.MIKROTIK_API_USER;
    const password = process.env.MIKROTIK_API_PASSWORD;
    const port = Number(process.env.MIKROTIK_API_PORT ?? 8728);

    if (!host || !user || !password) {
      throw new Error('MikroTik API configuration is missing');
    }

    const conn = new RouterOSAPI({
      host,
      user,
      password,
      port,
      timeout: 10,
    });

    try {
      await conn.connect();

      // قراءة جلسات Hotspot النشطة
      const sessions = await conn.write('/ip/hotspot/active/print');

      const matchingSessions = sessions.filter(
        (session) => session.user === username,
      );

      // فصل كل الجلسات المطابقة
      for (const session of matchingSessions) {
        if (!session['.id']) {
          throw new Error('Hotspot session ID is missing');
        }

        await conn.write('/ip/hotspot/active/remove', [
          `=.id=${session['.id']}`,
        ]);
      }

      // التحقق من اختفاء الجلسات
      const remainingSessions = await conn.write('/ip/hotspot/active/print');

      const stillActive = remainingSessions.some(
        (session) => session.user === username,
      );

      return {
        username,
        activeSessionsFound: matchingSessions.length,
        disconnectedSessions: stillActive
          ? matchingSessions.length - 1
          : matchingSessions.length,
        disconnected: !stillActive,
      };
    } finally {
      conn.close();
    }
  }
}
