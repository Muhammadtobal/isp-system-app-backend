import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeNetworkDto } from './create-employee-network.dto';

export class UpdateEmployeeNetworkDto extends PartialType(
  CreateEmployeeNetworkDto,
) {}
