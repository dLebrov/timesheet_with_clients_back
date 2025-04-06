import { ApiProperty, OmitType } from '@nestjs/swagger';
import { usersDto } from 'src/swagger-dto/users.dto';

export class LoginParamsDto {
  @ApiProperty()
  login: string;
  @ApiProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: OmitType(usersDto, ['password']) })
  user: Omit<usersDto, 'password'>;
}
