import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { User } from '../users/user.entity';
import { ExpenseCategory } from './expenseCategory.entity';
import { CreateExpenseCategoryDto } from './createExpenseCategory.dto';

export interface ExpenseCategoriesSearchParams {
  userId?: number;
}

@Injectable()
export class ExpenseCategoriesService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(ExpenseCategory) private expenseCategoriesRepository: Repository<ExpenseCategory>
  ) {}

  public async create(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
    const user = await this.findUser(createExpenseCategoryDto.userId);
    const newExpenseCategory = new ExpenseCategory(createExpenseCategoryDto);

    this.checkIfSumOfRevenuePercentageOfAllExpenseCategoriesIsValid(newExpenseCategory, user.expenseCategories);
    await this.expenseCategoriesRepository.save(newExpenseCategory);

    return newExpenseCategory;
  }

  public async get(params?: ExpenseCategoriesSearchParams): Promise<ExpenseCategory[]> {
    return await this.expenseCategoriesRepository.find(params);
  }

  private async findUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId, { relations: ['expenseCategories'] });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private checkIfSumOfRevenuePercentageOfAllExpenseCategoriesIsValid(
    newExpenseCategory: Omit<ExpenseCategory, 'id'>,
    existingUserExpenseCatories: ExpenseCategory[]
  ): void {
    const maxRevenuePercentage = 100;
    const existingRevenuePercentageSum = existingUserExpenseCatories.reduce((sum, expenseCategory) => {
      return (sum += expenseCategory.revenuePercentage);
    }, 0);

    if (existingRevenuePercentageSum + newExpenseCategory.revenuePercentage > maxRevenuePercentage) {
      throw new ConflictException('The revenue percentage of all expense categories cannot exceed 100%');
    }
  }
}
