import { OmitType } from '@nestjs/swagger';
import { servicesDto } from 'src/swagger-dto/services.dto';

export class createServiceDto extends OmitType(servicesDto, [
  'id',
  'users',
  'userId',
  'records',
  'createdAt',
]) {}

export class updateServiceDto extends OmitType(servicesDto, [
  'id',
  'users',
  'userId',
  'records',
  'createdAt',
]) {}
