import { OmitType } from '@nestjs/swagger';
import { client_subjectsDto } from 'src/swagger-dto/client_subjects.dto';

export class createClient_subjectsDto extends OmitType(client_subjectsDto, [
  'id',
  'clients',
  'subjects',
  'createdAt',
]) {}

export class updateClient_subjectsDto extends OmitType(client_subjectsDto, [
  'id',
  'clients',
  'subjects',
  'createdAt',
]) {}
