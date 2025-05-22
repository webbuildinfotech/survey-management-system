// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/users.module';
import { RoleModule } from './roles/roles.module';
import { databaseConfig } from './config/database.config';
import { BusinessModule } from './business/business.module';
import { QuestionsModule } from 'questions/question.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    TypeOrmModule.forRoot(databaseConfig),
    RoleModule,
    AuthModule,
    UserModule,
    BusinessModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
