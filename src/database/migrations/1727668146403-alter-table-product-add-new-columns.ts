import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProdIdAndDefaultPriceColumn1727668146403 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('products', [
      new TableColumn({
        name: 'defaultPrice',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'prodId',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'currency',
        type: 'varchar',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('products', ['defaultPrice', 'prodId', 'currency']);
  }
}
