import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRatingColumn1727230784868 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'reviews',
      new TableColumn({
        name: 'rating',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('reviews', 'rating');
  }
}
