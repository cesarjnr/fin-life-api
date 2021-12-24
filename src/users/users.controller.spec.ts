import { Test } from '@nestjs/testing';
import * as faker from 'faker';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './createUser.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

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
    it('should call the service method with the right payload', async () => {
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
