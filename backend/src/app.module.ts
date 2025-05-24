// src/app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/users.module';
import { RoleModule } from './roles/roles.module';
import { BusinessModule } from './business/business.module';
import { QuestionsModule } from 'questions/question.module';
import { databaseConfig } from 'config/database.config';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => databaseConfig
    }),
    RoleModule,
    AuthModule,
    UserModule,
    BusinessModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    console.log('MongoDB Connection Status:', this.connection.readyState === 1 ? 'Connected' : 'Disconnected');
  }
}