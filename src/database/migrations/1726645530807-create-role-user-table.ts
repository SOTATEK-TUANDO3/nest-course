import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRoleUserTable1726645530807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role_user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isUnique: true,
            isGenerated: true,
            unsigned: true,
            generationStrategy: 'increment',
          },
          {
            name: 'role_id',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_user', true);
  }
}
