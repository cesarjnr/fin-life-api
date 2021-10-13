import { Repository } from 'typeorm';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';

import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    await this.checkIfUserAlreadyExists(email);

    const hash = await this.generateHash(password);
    const user = new User({ name, email, password: hash });

    await this.usersRepository.save(user);

    return user;
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
