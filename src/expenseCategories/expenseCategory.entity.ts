import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { User } from '../users/user.entity';

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

  constructor(description: string, revenuePercentage: number, userId: number) {
    this.description = description;
    this.revenuePercentage = revenuePercentage;
    this.userId = userId;
  }
}
