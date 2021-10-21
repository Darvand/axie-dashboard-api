import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: 'nest',
  password: 'nest',
  database: 'nest',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: true,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: './migrations',
  },
};

export = config;
