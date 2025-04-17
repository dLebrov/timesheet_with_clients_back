import { OmitType } from '@nestjs/swagger';
import { subjectsDto } from 'src/swagger-dto/subjects.dto';

export class createSubjectDto extends OmitType(subjectsDto, [
  'id',
  'client_subjects',
  'createdAt',
]) {}

export class updateSubjectDto extends OmitType(subjectsDto, [
  'id',
  'client_subjects',
  'createdAt',
]) {}
