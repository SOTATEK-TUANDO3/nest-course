import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoryProductTable1726645699711 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'category_product',
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
            name: 'category_id',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'product_id',
            type: 'int',
            unsigned: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('category_product', true);
  }
}
