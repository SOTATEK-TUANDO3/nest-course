require('dotenv').config();

const dataSourceDefaultOptions = {
  type: (process.env.DB_CONNECTION as any) || 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || '3306',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
  // type: 'mysql' as any,
  // host: 'db',
  // port: '3307',
  // username: 'root',
  // password: 'secret',
  // database: 'ulearn',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  autoLoadEntities: true,
  timezone: 'local',
};

export default dataSourceDefaultOptions;
