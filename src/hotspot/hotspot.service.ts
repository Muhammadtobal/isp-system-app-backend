import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { HotspotProfile } from './entities/hotspot-profile.entity';

import { HotspotVoucher } from './entities/hotspot-voucher.entity';
import { RadiusService } from 'src/radius/radius.service';
import { FindAllHotspotProfileDto } from './dto/find-all-hotspot-profile.dto';
import {
  customPaginate,
  generateQueryConditions,
  generateQuerySorts,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';
import { CreateHotspotProfileDto } from './dto/create-profile.dto';
import { FindAllHotspotVoucherDto } from './dto/find-all-hotspot-voucher.dto';

@Injectable()
export class HotSpotService {
  constructor(
    @InjectRepository(HotspotProfile)
    private profileRepository: Repository<HotspotProfile>,

    @InjectRepository(HotspotVoucher)
    private voucherRepository: Repository<HotspotVoucher>,

    private radiusService: RadiusService,
  ) {}

  async createProfile(data: CreateHotspotProfileDto) {
    console.log('data', data);
    return this.profileRepository.save(data);
  }

  async generateVouchers(profileId: number, quantity: number) {
    const profile = await this.profileRepository.findOne({
      where: {
        id: profileId,
      },
    });
    if (!profile) return null;
    const vouchers: HotspotVoucher[] = [];

    for (let i = 0; i < quantity; i++) {
      const username = `HS${Date.now()}${i}`;

      const password = Math.random().toString(36).substring(2, 8);

      const voucher = await this.voucherRepository.save({
        code: username,

        username,

        password,

        profile_id: profile.id,
      });

      await this.radiusService.createHotspotUser(
        username,

        password,

        profile,
      );

      vouchers.push(voucher);
    }

    return vouchers;
  }

  async activateVoucher(username: string) {
    return this.voucherRepository.update(
      {
        username,
      },

      {
        status: 'ACTIVE',
        activated_at: new Date(),
      },
    );
  }

  public findAllHotspotProfile(filter: FindAllHotspotProfileDto) {
    const query = this.profileRepository
      .createQueryBuilder('hotspot_profile')
      .where('true');

    generateQuerySorts<HotspotProfile>(
      query,
      filter,
      HotspotProfile,
      'hotspot_profile',
    );
    generateQueryConditions<HotspotProfile>(query, filter, 'hotspot_profile');

    return customPaginate<HotspotProfile, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public async findAllHotspotVoucher(filter: FindAllHotspotVoucherDto) {
    const query = this.voucherRepository
      .createQueryBuilder('hotspot_voucher')
      .leftJoin('hotspot_voucher.profile', 'profile')
      .select(['hotspot_voucher', 'profile.name'])
      .where('true');

    generateQuerySorts<HotspotVoucher>(
      query,
      filter,
      HotspotVoucher,
      'hotspot_voucher',
    );

    generateQueryConditions<HotspotVoucher>(query, filter, 'hotspot_voucher');

    const result = await customPaginate<HotspotVoucher, PaginationMetadata>(
      query,
      {
        limit: filter.pagination.limit,
        page: filter.pagination.page,
      },
    );

    const onlineUsers = await this.radiusService.getOnlineUsers();

    const onlineSet = new Set(onlineUsers.map((user) => user.username));

    result.items = result.items.map((voucher: any) => ({
      ...voucher,
      is_online: onlineSet.has(voucher.username),
    }));

    return result;
  }
}
