import { ConnectionOptions } from 'typeorm';
import { Movie } from './src/entities/movie.entity';

// the same name as database container name
const DB_HOST = 'db';
const DB_PORT = 5432;

const config: ConnectionOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [Movie],
  ssl: false,
  synchronize: true,
};

export = config;
