import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { User } from '../users/user.entity';
import { ExpenseCategory } from './expenseCategory.entity';
import { CreateExpenseCategoryDto } from './createExpenseCategory.dto';

@Injectable()
export class ExpenseCategoriesService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(ExpenseCategory) private expenseCategoriesRepository: Repository<ExpenseCategory>
  ) {}

  public async create(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
    await this.checkIfUserExists(createExpenseCategoryDto.userId);

    const newExpenseCategory = new ExpenseCategory(createExpenseCategoryDto);

    await this.expenseCategoriesRepository.save(newExpenseCategory);

    return newExpenseCategory;
  }

  private async checkIfUserExists(userId: number): Promise<void> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
