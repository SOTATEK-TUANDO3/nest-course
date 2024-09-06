import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRoleTable1725443464481 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
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
            name: 'name',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles', true);
  }
}
