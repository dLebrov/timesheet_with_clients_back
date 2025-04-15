import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { usersDto } from 'src/swagger-dto/users.dto';
import { AuthService } from './../auth/auth.service';
import { CreateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async getAllUsersService(): Promise<Omit<usersDto, 'password'>[]> {
    return this.prisma.users.findMany({
      select: {
        id: true,
        surname: true,
        name: true,
        email: true,
        username: true,
        role: true,
        birthDate: true,
        phone: true,
        gender: true,
        createdAt: true,
        clients: {
          include: {
            users: false,
            records: false,
            client_subjects: false,
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
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async createUser(data: CreateUserDto): Promise<{
    access_token: string;
    user: Omit<usersDto, 'password'>;
  }> {
    const { email, password, username, ...user } = data;

    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const passwordHash = await this.hashPassword(password);

    const createdUser = await this.prisma.users.create({
      data: {
        email,
        username,
        password: passwordHash,
        ...user,
      },
    });

    return this.auth.loginIn(createdUser.username, password);
  }
}
