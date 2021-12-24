import * as faker from 'faker';
import { Test } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './createUser.dto';

describe('UsersController', () => {
  let usersService: UsersService;
  let usersController: UsersController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn()
          }
        }
      ]
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should call the method of the service with the correct payload', async () => {
      const createUserDto: CreateUserDto = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(16)
      };

      await usersController.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
