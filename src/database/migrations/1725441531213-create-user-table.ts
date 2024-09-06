import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1725441531213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            name: 'email',
            type: 'varchar',
            length: '120',
            isUnique: true,
          },
          {
            name: 'userName',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'isVerified',
            type: 'boolean',
            default: true,
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
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
