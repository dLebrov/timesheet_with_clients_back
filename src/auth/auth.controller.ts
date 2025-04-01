import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
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
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() body: LoginDto) {
    return this.authService.loginIn(body.login, body.password);
  }
}
