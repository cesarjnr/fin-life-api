import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUsersTable1633236647888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'name',
          type: 'varchar'
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}