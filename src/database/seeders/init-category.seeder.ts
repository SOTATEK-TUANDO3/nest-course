import { Category } from 'src/entities/category.entity';
import { categories } from 'src/master-data/category';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class CategorySeed implements Seeder {
  public async run(dataSource: DataSource) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log('testing....');
      await queryRunner.manager.clear(Category);
      await queryRunner.manager.getRepository(Category).save(categories);
      await queryRunner.commitTransaction();
      console.log(`\nnFinish Seed Categories Success.`);
    } catch (error) {
      console.log('\nFailed To Seed Categories Data.', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
