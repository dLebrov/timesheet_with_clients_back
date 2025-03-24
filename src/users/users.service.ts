import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { usersDto } from 'src/swagger-dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<usersDto[]> {
    return this.prisma.users.findMany();
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async createUser(data: Omit<usersDto, 'id'>): Promise<usersDto> {
    const { email, name, surname, password } = data;

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const passwordHash = await this.hashPassword(password);

    return this.prisma.users.create({
      data: {
        name,
        surname,
        email,
        password: passwordHash,
      },
    });
  }
}
