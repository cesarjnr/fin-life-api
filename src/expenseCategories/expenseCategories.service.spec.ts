import * as faker from 'faker';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { User } from '../users/user.entity';
import {
  ExpenseCategoriesService,
  CreateExpenseCategoryDto,
  ExpenseCategoriesSearchParams
} from './expenseCategories.service';
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
            save: jest.fn(),
            find: jest.fn()
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

  describe('create', () => {
    const createExpenseCategoryDto: CreateExpenseCategoryDto = {
      userId: faker.datatype.number(100),
      description: faker.lorem.paragraph(),
      revenuePercentage: 30
    };

    it('should throw an NotFoundException when no user is found for the given userId', async () => {
      const thrownError = new NotFoundException('User not found');

      mockUsersRepository.findOne = jest.fn();
      mockExpenseCategoriesRepository.save = jest.fn();

      await expect(expenseCategoriesService.create(createExpenseCategoryDto)).rejects.toStrictEqual(thrownError);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith(createExpenseCategoryDto.userId, {
        relations: ['expenseCategories']
      });
      expect(mockExpenseCategoriesRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a ConflictException when the revenue percentage of the new expense category plus the existing ones outweighs 100', async () => {
      const thrownError = new ConflictException('The revenue percentage of all expense categories cannot exceed 100%');
      const user = new User(faker.name.findName(), faker.internet.email(), faker.internet.password(16));
      const existingExpenseCategories = [
        new ExpenseCategory(createExpenseCategoryDto.description, 50, createExpenseCategoryDto.userId),
        new ExpenseCategory(createExpenseCategoryDto.description, 30, createExpenseCategoryDto.userId)
      ];

      user.id = createExpenseCategoryDto.userId;
      user.expenseCategories = existingExpenseCategories;
      mockUsersRepository.findOne = jest.fn().mockResolvedValue(user);

      await expect(expenseCategoriesService.create(createExpenseCategoryDto)).rejects.toStrictEqual(thrownError);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith(user.id, { relations: ['expenseCategories'] });
      expect(mockExpenseCategoriesRepository.save).not.toHaveBeenCalled();
    });

    it('should create an expense category', async () => {
      const user = new User(faker.name.findName(), faker.internet.email(), faker.internet.password(16));
      const newExpenseCategoryId = faker.datatype.number(100);

      user.id = createExpenseCategoryDto.userId;
      user.expenseCategories = [];
      mockUsersRepository.findOne = jest.fn().mockResolvedValue(user);
      mockExpenseCategoriesRepository.save = jest.fn().mockImplementation((expenseCategory: ExpenseCategory) => {
        expenseCategory.id = newExpenseCategoryId;

        return expenseCategory;
      });

      const newExpenseCategory = await expenseCategoriesService.create(createExpenseCategoryDto);

      expect(newExpenseCategory).toEqual({
        id: newExpenseCategoryId,
        description: createExpenseCategoryDto.description,
        revenuePercentage: createExpenseCategoryDto.revenuePercentage,
        userId: user.id
      });
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith(createExpenseCategoryDto.userId, {
        relations: ['expenseCategories']
      });
      expect(mockExpenseCategoriesRepository.save).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should get the expense categories', async () => {
      const userId = faker.datatype.number(100);
      const params: ExpenseCategoriesSearchParams = { userId };
      const expenseCategory = new ExpenseCategory(faker.lorem.paragraph(), faker.datatype.number(100), userId);
      expenseCategory.id = faker.datatype.number(100);

      mockExpenseCategoriesRepository.find.mockResolvedValue([expenseCategory]);

      const returnedExpenseCategories = await expenseCategoriesService.get(params);

      expect(returnedExpenseCategories).toHaveLength(1);
      expect(returnedExpenseCategories[0]).toStrictEqual(expenseCategory);
      expect(mockExpenseCategoriesRepository.find).toHaveBeenCalledWith(params);
    });
  });
});
