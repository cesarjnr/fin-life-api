import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createCashFlowTable1633812932620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cash_flow',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'user_id',
            type: 'int'
          },
          {
            name: 'category_id',
            type: 'int',
            isNullable: true
          },
          {
            name: 'description',
            type: 'varchar'
          },
          {
            name: 'value',
            type: 'float'
          },
          {
            name: 'cash_flow_type',
            type: 'enum',
            enum: ['revenue', 'expense']
          },
          {
            name: 'date',
            type: 'timestamp'
          }
        ],
        foreignKeys: [
          {
            name: 'cash_flow_user_id_fkey',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id']
          },
          {
            name: 'cash_flow_category_id_fkey',
            columnNames: ['category_id'],
            referencedTableName: 'expenses_categories',
            referencedColumnNames: ['id']
          }
        ],
        indices: [
          {
            name: 'cash_flow_user_id_category_id_idx',
            columnNames: ['user_id', 'category_id']
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cash_flow');
  }
}
