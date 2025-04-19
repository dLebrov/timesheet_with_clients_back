import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { usersDto } from 'src/swagger-dto/users.dto';

export class LoginParamsDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  token: string;

  @ApiProperty({ type: () => usersDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => usersDto)
  user: Omit<usersDto, 'password'>;
}
