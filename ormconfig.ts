import { DataSource } from 'typeorm';

require('dotenv').config();

const dataSourceDefaultOptions = {
  type: (process.env.DB_CONNECTION as any) || 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || '3306',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  autoLoadEntities: true,
  timezone: 'local',
  migrations: ['dist/src/database/migrations/*.js'],
  seeds: ['dist/src/database/seeders/*.js'],
};

export const AppDataSource = new DataSource(dataSourceDefaultOptions);
export default dataSourceDefaultOptions;
