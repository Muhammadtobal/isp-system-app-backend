import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RadiusService } from './radius.service';

import { RadCheck } from './entities/ radcheck.entity';
import { RadReply } from './entities/radreply.entity';
import { RadAcct } from './entities/radacct.entity';
import { RadPostAuth } from './entities/radpostauth.entity';
import { Nas } from './entities/nas.entity';
import { RadUserGroup } from './entities/radusergroup.entity';
import { RadGroupReply } from './entities/radgroupreply.entity';
import { RadGroupCheck } from './entities/radgroupcheck.entity';
import { RadiusController } from './radius.controller';
import { NetworkRadius } from './entities/network-radius.entity';
import { GroupNetworkRadius } from './entities/group-network-radius';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RadCheck,
      RadReply,
      RadAcct,
      RadPostAuth,
      Nas,
      RadGroupCheck,
      RadGroupReply,
      RadUserGroup,
      NetworkRadius,
      GroupNetworkRadius,
    ]),
  ],
  controllers: [RadiusController],
  providers: [RadiusService],

  exports: [RadiusService],
})
export class RadiusModule {}
