import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveTotalAmountColumn1727150892558 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'totalAmount');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'totalAmount',
        type: 'int',
      }),
    );
  }
}
