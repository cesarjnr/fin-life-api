import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { User } from '../users/user.entity';
import { CreateExpenseCategoryDto } from './createExpenseCategory.dto';

@Entity('expense_categories')
export class ExpenseCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ name: 'revenue_percentage' })
  revenuePercentage: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.expenseCategories)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  constructor(expenseCategory: CreateExpenseCategoryDto) {
    Object.assign(this, expenseCategory);
  }
}
