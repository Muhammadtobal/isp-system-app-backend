import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RadiusService } from './radius.service';

import { RadCheck } from './entities/ radcheck.entity';
import { RadReply } from './entities/radreply.entity';
import { RadAcct } from './entities/radacct.entity';
import { RadPostAuth } from './entities/radpostauth.entity';
import { Nas } from './entities/nas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RadCheck, RadReply, RadAcct, RadPostAuth, Nas]),
  ],

  providers: [RadiusService],

  exports: [RadiusService],
})
export class RadiusModule {}
