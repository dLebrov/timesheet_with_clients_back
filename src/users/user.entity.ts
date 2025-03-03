import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'id пользователя',
    example: '1',
    required: true,
  })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    required: true,
  })
  @Column({ name: 'name', type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    required: true,
  })
  @Column({ name: 'surname', type: 'varchar', length: 50, nullable: false })
  surname: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'qwerty123',
    required: true,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,20}$',
    minLength: 6,
    maxLength: 20,
  })
  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;
}
