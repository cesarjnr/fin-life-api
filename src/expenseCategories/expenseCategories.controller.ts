import { Controller, Post, Body } from '@nestjs/common';

import { ExpenseCategoriesService } from './expenseCategories.service';
import { CreateExpenseCategoryDto } from './createExpenseCategory.dto';
import { ExpenseCategory } from './expenseCategory.entity';

@Controller('expense-categories')
export class ExpenseCategoriesController {
  constructor(private expenseCategoriesService: ExpenseCategoriesService) {}

  @Post()
  public async create(@Body() createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
    return this.expenseCategoriesService.create(createExpenseCategoryDto);
  }
}
