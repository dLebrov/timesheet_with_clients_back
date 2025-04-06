import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
import { CreateUsersParamsDto } from './dto/users.dto';

@ApiTags('users')
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
  async createUser(
    @Body() createUserDto: CreateUsersParamsDto,
  ): Promise<{ access_token: string; user: Omit<usersDto, 'password'> }> {
    return this.usersService.createUser(createUserDto);
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
  async getAllUsers(): Promise<Omit<usersDto[], 'password'>> {
    return this.usersService.findAll();
  }
}
