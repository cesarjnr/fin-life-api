import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../users/user.entity';
import { ExpenseCategoriesService } from './expenseCategories.service';
import { ExpenseCategory } from './expenseCategory.entity';

describe('ExpenseCategoriesService', () => {
  let mockUsersRepository: jest.Mocked<Repository<User>>;
  let mockExpenseCategoriesRepository: jest.Mocked<Repository<ExpenseCategory>>;
  let expenseCategoriesService: ExpenseCategoriesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(ExpenseCategory),
          useValue: {
            save: jest.fn()
          }
        },
        ExpenseCategoriesService
      ]
    }).compile();

    mockUsersRepository = moduleRef.get<jest.Mocked<Repository<User>>>(getRepositoryToken(User));
    mockExpenseCategoriesRepository = moduleRef.get<jest.Mocked<Repository<ExpenseCategory>>>(
      getRepositoryToken(ExpenseCategory)
    );
    expenseCategoriesService = moduleRef.get<ExpenseCategoriesService>(ExpenseCategoriesService);
  });
});
