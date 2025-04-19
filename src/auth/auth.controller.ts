import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginParamsDto, LoginResponseDto } from './dto/login.dto';
import { usersDto } from 'src/swagger-dto/users.dto';
import { validateDto } from 'src/utils';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'Вход пользователя',
    description:
      'Аутентификация пользователя с использованием email (или username) и пароля. При успешной аутентификации возвращается JWT access token и данные пользователя (без пароля).',
  })
  @ApiResponse({
    status: 200,
    description:
      'Пользователь успешно аутентифицирован. Возвращает access token и информацию о пользователе.',
    type: [LoginResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() body: LoginParamsDto) {
    const result = validateDto(LoginParamsDto, body);

    if (result.valid) {
      return this.authService.loginIn(body.login, body.password);
    } else {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }
  }
}
