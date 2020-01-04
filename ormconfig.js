const SOURCE_PATH = process.env.NODE_ENV === 'development' ? 'src' : 'dist';

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
