import * as faker from 'faker';
import { Test } from '@nestjs/testing';

import { ExpenseCategoriesController } from './expenseCategories.controller';
import { ExpenseCategoriesService } from './expenseCategories.service';

describe('ExpenseCategoriesController', () => {
  let mockExpenseCategoriesService: jest.Mocked<ExpenseCategoriesService>;
  let expenseCategoriesController: ExpenseCategoriesController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ExpenseCategoriesController],
      providers: [
        {
          provide: ExpenseCategoriesService,
          useValue: {
            create: jest.fn()
          }
        }
      ]
    }).compile();

    mockExpenseCategoriesService = moduleRef.get<ExpenseCategoriesService>(
      ExpenseCategoriesService
    ) as jest.Mocked<ExpenseCategoriesService>;
    expenseCategoriesController = moduleRef.get<ExpenseCategoriesController>(ExpenseCategoriesController);
  });

  describe('create', () => {
    it('should call the method of the service with the correct payload', async () => {
      const userId = faker.datatype.number(100);
      const body = {
        description: faker.lorem.paragraph(),
        revenuePercentage: faker.datatype.number(100)
      };

      await expenseCategoriesController.create(String(userId), body);

      expect(mockExpenseCategoriesService.create).toHaveBeenCalledWith({ ...body, userId });
    });
  });
});
