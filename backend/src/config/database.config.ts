import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const developmentConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DEV_DB_HOST ?? 'localhost',
  port: parseInt(process.env.DEV_DB_PORT ?? '5432'),
  username: process.env.DEV_DB_USERNAME ?? 'postgres',
  password: process.env.DEV_DB_PASSWORD ?? 'root',
  database: process.env.DEV_DB_NAME ?? 'survey-management',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Only for development
  // logging: true,
};

const productionConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PROD_DB_HOST,
  port: parseInt(process.env.DEV_DB_PORT ?? '5432'),
  username: process.env.PROD_DB_USERNAME,
  password: process.env.PROD_DB_PASSWORD,
  database: process.env.PROD_DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Never true in production
  // logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
};

export const databaseConfig = process.env.NODE_ENV === 'production' 
  ? productionConfig 
  : developmentConfig;