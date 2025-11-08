import { OmitType } from '@nestjs/swagger';
import { usersDto } from 'src/swagger-dto/users.dto';

export class CreateUserDto extends OmitType(usersDto, [
  'client_subjects',
  'subjects',
  'records',
  'services',
  'clients',
  'id',
  'createdAt',
]) {}
