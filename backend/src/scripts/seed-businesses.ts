import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { BusinessService } from '../business/business.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const businessService = app.get(BusinessService);

  try {
    await businessService.seedBusinesses();
    console.log('Businesses seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding businesses:', error);
    process.exit(1);
  }
}

bootstrap(); 


//npm run seed:businesses