import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { usersDto } from 'src/swagger-dto/users.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async loginIn(
    login: string,
    password: string,
  ): Promise<{ access_token: string; user: Omit<usersDto, 'password'> }> {
    const user = await this.prisma.users.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
      include: {
        clients: {
          include: {
            client_subjects: false,
            records: false,
          },
        },
        services: {
          include: {
            users: false,
            records: false,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const { password: _, ...userWithoutPassword } = user;

    const payload: Omit<usersDto, 'password'> = { ...userWithoutPassword };

    const access_token = this.jwtService.sign(payload);

    return { access_token, user: payload };
  }

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (error) {}
  }
}
