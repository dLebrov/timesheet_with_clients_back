import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(props: {
    name: string;
    surname: string;
    password: string;
  }): Promise<User> {
    const { name, surname, password } = props;

    const user = this.userRepository.create({
      name,
      surname,
      password: password,
    });

    return this.userRepository.save(user);
  }
}
