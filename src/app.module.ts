import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

import { UsersModule } from './users/users.module';
import { ExpenseCategoriesModule } from './expenseCategories/expenseCategories.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true
        })
    }),
    UsersModule,
    ExpenseCategoriesModule
  ]
})
export class AppModule {}
