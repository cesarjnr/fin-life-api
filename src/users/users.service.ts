import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';

import { User } from './user.entity';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    await this.checkIfUserAlreadyExists(email);

    const hash = await this.generateHash(password);
    const newUser = new User(name, email, hash);

    await this.usersRepository.save(newUser);

    return newUser;
  }

  private async checkIfUserAlreadyExists(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ email });

    if (user) {
      throw new ConflictException('Email already exists');
    }
  }

  private async generateHash(password: string): Promise<string> {
    const rounds = 10;

    return await hash(password, rounds);
  }
}
