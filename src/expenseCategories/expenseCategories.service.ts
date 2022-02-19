import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { User } from '../users/user.entity';
import { ExpenseCategory } from './expenseCategory.entity';

export interface CreateExpenseCategoryDto {
  userId: number;
  description: string;
  revenuePercentage: number;
}
export type UpdateExpenseCategoryDto = Omit<CreateExpenseCategoryDto, 'userId'>;
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
    const { description, revenuePercentage, userId } = createExpenseCategoryDto;
    const user = await this.findUser(userId);
    const newExpenseCategory = new ExpenseCategory(description, revenuePercentage, userId);

    this.checkIfSumOfRevenuePercentageOfAllExpenseCategoriesIsValid([...user.expenseCategories, newExpenseCategory]);
    await this.expenseCategoriesRepository.save(newExpenseCategory);

    return newExpenseCategory;
  }

  public async get(params?: ExpenseCategoriesSearchParams): Promise<ExpenseCategory[]> {
    return await this.expenseCategoriesRepository.find(params);
  }

  public async update(
    userId: number,
    expenseCategoryId: number,
    updateExpenseCategoryDto: UpdateExpenseCategoryDto
  ): Promise<ExpenseCategory> {
    const user = await this.findUser(userId);
    const expenseCategory = this.findExpenseCategory(user, expenseCategoryId);

    Object.assign(expenseCategory, updateExpenseCategoryDto);
    this.checkIfSumOfRevenuePercentageOfAllExpenseCategoriesIsValid(user.expenseCategories);
    await this.expenseCategoriesRepository.save(expenseCategory);

    return expenseCategory;
  }

  private async findUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId, { relations: ['expenseCategories'] });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private checkIfSumOfRevenuePercentageOfAllExpenseCategoriesIsValid(expenseCategories: ExpenseCategory[]): void {
    const maxRevenuePercentage = 100;
    const existingRevenuePercentageSum = expenseCategories.reduce((sum, expenseCategory) => {
      return (sum += expenseCategory.revenuePercentage);
    }, 0);

    if (existingRevenuePercentageSum > maxRevenuePercentage) {
      throw new ConflictException('The revenue percentage of all your expense categories cannot exceed 100%');
    }
  }

  private findExpenseCategory(user: User, expenseCategoryId: number): ExpenseCategory {
    const expenseCategory = user.expenseCategories.find((expenseCategory) => expenseCategory.id === expenseCategoryId);

    if (!expenseCategory) {
      throw new NotFoundException('Expense category not found');
    }

    return expenseCategory;
  }
}
