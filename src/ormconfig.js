module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: true,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: './migrations',
  },
  autoLoadEntities: true,
  keepConnectionAlive: true,
  // ssl: { rejectUnauthorized: false },
};
