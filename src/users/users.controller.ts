import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { usersDto } from 'src/swagger-dto/users.dto';
import { CreateUserDto } from './dto/users.dto';
import { validateDto } from 'src/utils';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно создан',
    type: [OmitType(usersDto, ['password'])],
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<{
    access_token: string;
    user: Omit<usersDto, 'password' | 'clients'>;
  }> {
    const result = validateDto(CreateUserDto, createUserDto);

    if (result.valid && result.data) {
      return this.usersService.createUser(result.data);
    } else {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список всех пользователей',
    type: [OmitType(usersDto, ['password'])],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<Omit<usersDto, 'password'>[]> {
    return this.usersService.getAllUsersService();
  }
}
