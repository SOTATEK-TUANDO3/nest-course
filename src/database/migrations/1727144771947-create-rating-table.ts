import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRatingTable1727144771947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ratings',
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
            name: 'customerId',
            type: 'int',
          },
          {
            name: 'productId',
            type: 'int',
          },
          {
            name: 'ratting',
            type: 'int',
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
    await queryRunner.dropTable('ratings', true);
  }
}
