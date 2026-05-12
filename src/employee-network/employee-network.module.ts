import { forwardRef, Module } from '@nestjs/common';
import { EmployeeNetworkService } from './employee-network.service';
import { EmployeeNetworkController } from './employee-network.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeNetwork } from './entities/employee-network.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeNetwork])],
  exports: [EmployeeNetworkService],
  controllers: [EmployeeNetworkController],
  providers: [EmployeeNetworkService],
})
export class EmployeeNetworkModule {}
