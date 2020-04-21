const fs = require('fs');
const dotenv = require('dotenv');
const SOURCE_PATH = process.env.NODE_ENV === 'development' ? 'src' : 'dist';
// const config = dotenv.parse(
//   fs.readFileSync(`.${process.env.NODE_ENV || 'development'}.env`),
// );
dotenv.config();

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [`${SOURCE_PATH}/**/**.entity{.ts,.js}`],
  synchronize: false,
  migrations: ['migrations/*.ts'],
  migrationsRun: false,
  cache: true,
  cli: {
    migrationsDir: 'migrations',
  },
  // logging: process.env.NODE_ENV === 'production' ? false : ['query'],
};
