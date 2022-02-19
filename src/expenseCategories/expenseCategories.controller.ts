import { Controller, Post, Body, Param, Get } from '@nestjs/common';

import { ExpenseCategoriesService, CreateExpenseCategoryDto } from './expenseCategories.service';
import { ExpenseCategory } from './expenseCategory.entity';

@Controller('users/:userId/expense-categories')
export class ExpenseCategoriesController {
  constructor(private expenseCategoriesService: ExpenseCategoriesService) {}

  @Post()
  public async create(
    @Param('userId') userId: string,
    @Body() createExpenseCategoryDto: Omit<CreateExpenseCategoryDto, 'userId'>
  ): Promise<ExpenseCategory> {
    return await this.expenseCategoriesService.create({ ...createExpenseCategoryDto, userId: Number(userId) });
  }

  @Get()
  public async get(@Param('userId') userId: string): Promise<ExpenseCategory[]> {
    return await this.expenseCategoriesService.get({ userId: Number(userId) });
  }
}
