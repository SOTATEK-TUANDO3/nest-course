import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceDefaultOptions from 'ormconfig';
import { CreateAdminCommand } from './create-admin.command';
import { CreateAdminQuestions } from './questions/create-admin.question';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceDefaultOptions), TypeOrmModule.forFeature([User, Role])],
  providers: [CreateAdminQuestions, CreateAdminCommand],
  exports: [],
})
export class CommandModule {}
