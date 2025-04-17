import { OmitType } from '@nestjs/swagger';
import { recordsDto } from 'src/swagger-dto/records.dto';

export class createRecordDto extends OmitType(recordsDto, [
  'id',
  'clients',
  'services',
  'createdAt',
]) {}

export class updateRecordDto extends OmitType(recordsDto, [
  'id',
  'clients',
  'services',
  'createdAt',
]) {}
