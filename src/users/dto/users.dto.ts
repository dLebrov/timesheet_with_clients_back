import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';

export class CreateUsersParamsDto {
  @ApiProperty()
  surname: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ enum: Gender, enumName: 'Gender' })
  gender: Gender;
  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;
  @ApiProperty()
  birthDate: Date;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  password: string;
}
