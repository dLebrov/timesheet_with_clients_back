import { OmitType } from '@nestjs/swagger';
import { clientsDto } from 'src/swagger-dto/clients.dto';

export class createClientDto extends OmitType(clientsDto, [
  'id',
  'users',
  'client_subjects',
  'records',
  'createdAt',
]) {}

export class createClientParamsDto extends OmitType(clientsDto, [
  'id',
  'users',
  'userId',
  'client_subjects',
  'records',
  'createdAt',
]) {}

export class updateClientDto extends OmitType(clientsDto, [
  'id',
  'users',
  'userId',
  'client_subjects',
  'records',
  'createdAt',
]) {}
