import { OmitType } from '@nestjs/swagger';
import { recordsDto } from 'src/swagger-dto/records.dto';

export class createRecordDto extends OmitType(recordsDto, [
  'id',
  'userId',
  'subjects',
  'users',
  'clients',
  'services',
  'createdAt',
]) {}

export class updateRecordDto extends OmitType(recordsDto, [
  'id',
  'userId',
  'users',
  'subjects',
  'clients',
  'services',
  'createdAt',
]) {}
