import { Module } from '@nestjs/common';
import { EmployeeNetworkService } from './employee-network.service';
import { EmployeeNetworkController } from './employee-network.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeNetwork } from './entities/employee-network.entity';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeNetwork]), EmployeeModule],
  controllers: [EmployeeNetworkController],
  providers: [EmployeeNetworkService],
})
export class EmployeeNetworkModule {}
