import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { RadCheck } from './entities/ radcheck.entity';
import { RadReply } from './entities/radreply.entity';
import { RadAcct } from './entities/radacct.entity';

@Injectable()
export class RadiusService {
  constructor(
    @InjectRepository(RadCheck)
    private readonly radCheckRepository: Repository<RadCheck>,

    @InjectRepository(RadReply)
    private readonly radReplyRepository: Repository<RadReply>,

    @InjectRepository(RadAcct)
    private readonly radAcctRepository: Repository<RadAcct>,
  ) {}

  /*
  ============================================
  إنشاء مستخدم PPPoE
  ============================================
  */
  async createPppoeUser(username: string, password: string, plan: any) {
    // 1- إضافة اسم المستخدم وكلمة المرور

    await this.radCheckRepository.save({
      username,

      attribute: 'Cleartext-Password',

      op: ':=',

      value: password,
    });

    // 2- إضافة سرعة الإنترنت

    await this.radReplyRepository.save({
      username,

      attribute: 'Mikrotik-Rate-Limit',

      op: ':=',

      value: `${plan.download_speed}k/${plan.upload_speed}k`,
    });

    // 3- عدد الجلسات

    if (plan.simultaneous_use) {
      await this.radReplyRepository.save({
        username,

        attribute: 'Simultaneous-Use',

        op: ':=',

        value: String(plan.simultaneous_use),
      });
    }

    // 4- مدة الجلسة

    if (plan.session_timeout) {
      await this.radReplyRepository.save({
        username,

        attribute: 'Session-Timeout',

        op: ':=',

        value: String(plan.session_timeout),
      });
    }

    return {
      username,
      message: 'Radius user created',
    };
  }

  /*
  ============================================
  تغيير كلمة المرور
  ============================================
  */

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

  /*
  ============================================
  تحديث الباقة
  ============================================
  */

  async updatePlan(username: string, plan: any) {
    // حذف خصائص السرعة القديمة

    await this.radReplyRepository.delete({
      username,
    });

    // إعادة بناء الخصائص

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

  /*
  ============================================
  تعطيل مستخدم
  ============================================
  */

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

  /*
  ============================================
  حذف مستخدم من Radius
  ============================================
  */

  async deleteUser(username: string) {
    await this.radCheckRepository.delete({
      username,
    });

    await this.radReplyRepository.delete({
      username,
    });

    return true;
  }

  /*
  ============================================
  المستخدمون المتصلون حاليا
  ============================================
  */

  async getOnlineUsers() {
    return await this.radAcctRepository.find({
      where: {
        acctstoptime: IsNull(),
      },
    });
  }

  /*
  ============================================
  استهلاك مستخدم
  ============================================
  */

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

  async createHotspotUser(username: string, password: string, profile: any) {
    await this.radCheckRepository.save({
      username,

      attribute: 'Cleartext-Password',

      op: ':=',

      value: password,
    });

    await this.radReplyRepository.save({
      username,

      attribute: 'Mikrotik-Rate-Limit',

      op: ':=',

      value: `${profile.download_speed}k/${profile.upload_speed}k`,
    });

    if (profile.session_time) {
      await this.radReplyRepository.save({
        username,

        attribute: 'Session-Timeout',

        op: ':=',

        value: String(profile.session_time),
      });
    }

    if (profile.quota_mb) {
      await this.radReplyRepository.save({
        username,

        attribute: 'Mikrotik-Total-Limit',

        op: ':=',

        value: String(profile.quota_mb * 1024 * 1024),
      });
    }

    return true;
  }
}
