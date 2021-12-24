import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { CreateExpenseCategoryDto } from './createExpenseCategory.dto';

@Entity('expense_categories')
export class ExpenseCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  description: string;

  @Column({ name: 'revenue_percentage' })
  revenuePercentage: number;

  constructor(createExpenseCategoryDto: CreateExpenseCategoryDto) {
    Object.assign(this, createExpenseCategoryDto);
  }
}
