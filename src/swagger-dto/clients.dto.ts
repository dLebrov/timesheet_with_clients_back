import { ApiProperty } from '@nestjs/swagger';
import { usersDto } from './users.dto';

export class clientsDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  users: Omit<usersDto, 'clients'>;
  @ApiProperty()
  surname: string;
  @ApiProperty()
  name: string;
}
