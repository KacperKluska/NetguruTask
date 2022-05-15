import { ConnectionOptions } from 'typeorm';
import { Movie } from './src/entities/movie.entity';

/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,

  entities: [Movie],
  ssl: false,
  synchronize: true,
};

export = config;
