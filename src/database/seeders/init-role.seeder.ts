import { Role } from 'src/entities/role.entity';
import { roles } from 'src/master-data/role';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class RoleSeed implements Seeder {
  public async run(dataSource: DataSource) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.clear(Role);
      await queryRunner.manager.getRepository(Role).save(roles);
      await queryRunner.commitTransaction();
      console.log(`\nnFinish Seed Roles Success.`);
    } catch (error) {
      console.log('\nFailed To Seed Roles Data.', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
