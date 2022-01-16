import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { CreateUserDto } from './createUser.dto';
import { ExpenseCategory } from '../expenseCategories/expenseCategory.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => ExpenseCategory, (expenseCategory) => expenseCategory.user)
  expenseCategories: ExpenseCategory[];

  constructor(createUserDto: CreateUserDto) {
    Object.assign(this, createUserDto);
  }
}
