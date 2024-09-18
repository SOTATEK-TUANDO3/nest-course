import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Command, CommandRunner, InquirerService, Option } from 'nest-commander';
import { Roles } from 'src/app/enums/common.enum';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Command({
  name: 'create-admin',
  description: 'Create a system admin account',
  arguments: '[email] [password]',
})
export class CreateAdminCommand extends CommandRunner {
  constructor(
    private readonly inquirer: InquirerService,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async run(): Promise<void> {
    const { email, password } = await this.inquirer.prompt<{ email: string; password: string }>(
      'create-admin-questions',
      undefined,
    );
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const adminRole = await this.roleRepo.findOneBy({ code: Roles.ADMIN });
    if (!adminRole) {
      console.error('\nPlease run command `create-role`');
      return;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.getRepository(User).save({
        email: email,
        userName: email,
        password: passwordHash,
        roles: [adminRole],
        isVerified: true,
      });

      await queryRunner.commitTransaction();
      console.log('\nCreate admin successfully.');
    } catch (error) {
      console.log('CreateAdminCommand error: ', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  @Option({
    flags: '-s, --shell <shell>',
  })
  parseShell(val: string) {
    return val;
  }
}
