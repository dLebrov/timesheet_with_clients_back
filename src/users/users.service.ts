import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { usersDto } from 'src/swagger-dto/users.dto';
import { AuthService } from './../auth/auth.service';
import { CreateUsersParamsDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async findAll(): Promise<usersDto[]> {
    return this.prisma.users.findMany();
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async createUser(
    data: CreateUsersParamsDto,
  ): Promise<{ access_token: string; user: Omit<usersDto, 'password'> }> {
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
