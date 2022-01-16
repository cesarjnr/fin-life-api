import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/users/user.entity';
import { ExpenseCategory } from './expenseCategory.entity';
import { ExpenseCategoriesController } from './expenseCategories.controller';
import { ExpenseCategoriesService } from './expenseCategories.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ExpenseCategory])],
  controllers: [ExpenseCategoriesController],
  providers: [ExpenseCategoriesService]
})
export class ExpenseCategoriesModule {}
