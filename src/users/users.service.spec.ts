import { hash } from 'bcrypt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import * as faker from 'faker';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

jest.mock('bcrypt');

describe('UsersService', () => {
  const mockHashFn = hash as jest.MockedFunction<typeof hash>;
  let mockUsersRepository: jest.Mocked<Repository<User>>;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn()
          }
        },
        UsersService
      ]
    }).compile();

    mockUsersRepository = moduleRef.get<jest.Mocked<Repository<User>>>(
      getRepositoryToken(User)
    );
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const hash = faker.git.commitSha();
    const createUserDto: CreateUserDto = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(16)
    };

    beforeEach(() => {
      mockHashFn.mockImplementation(() => Promise.resolve(hash));
    });

    it('should create a user', async () => {
      await usersService.create(createUserDto);

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        email: createUserDto.email
      });
      expect(mockHashFn).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUsersRepository.save).toHaveBeenCalledWith({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hash
      });
    });

    it('should catch a ConflictException when the given email already exists', async () => {
      const thrownError = new ConflictException('Email already exists');
      const existingUser: User = {
        id: faker.datatype.number(100),
        name: faker.name.findName(),
        email: createUserDto.email,
        password: faker.internet.password(10)
      };

      mockUsersRepository.findOne.mockResolvedValue(existingUser);

      await expect(usersService.create(createUserDto)).rejects.toStrictEqual(
        thrownError
      );
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        email: createUserDto.email
      });
      expect(mockHashFn).not.toHaveBeenCalled();
      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });
  });
});
