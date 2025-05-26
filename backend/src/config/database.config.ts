import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

const developmentConfig: MongooseModuleOptions = {
  uri: process.env.MONGODB_URI || 'mongodb://root:IrLAMi4VWCA!@15.207.161.119:27017/admin?directConnection=true&authSource=admin',
  // uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/survey-apps',
  autoIndex: true, 
};

const productionConfig: MongooseModuleOptions = {
  uri: process.env.MONGODB_URI,
};

export const databaseConfig = process.env.NODE_ENV === 'production' 
  ? productionConfig 
  : developmentConfig;