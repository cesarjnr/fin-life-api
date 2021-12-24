import { Injectable } from '@nestjs/common';

import { CreateExpenseCategoryDto } from './createExpenseCategory.dto';
import { ExpenseCategory } from './expenseCategory.entity';

@Injectable()
export class ExpenseCategoriesService {
  public async create(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
    return {} as ExpenseCategory;
  }
}
