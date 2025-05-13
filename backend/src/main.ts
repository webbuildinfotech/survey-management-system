import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoleSeedService } from 'roles/role.seed';

async function bootstrap() {
  try {

    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3000;
    // Enable CORS
    app.enableCors({
      origin: '*', // Replace with your frontend URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Inject the RoleSeedService and call seedRoles
    const roleSeedService = app.get(RoleSeedService);
    await roleSeedService.seedRoles();  // Seed roles


    await app.listen(port);
    console.log(`Server is running on: http://localhost:${port}`); // Log the port

  } catch (error) {
    process.exit(1); // Exit the process with failure
  }
}
bootstrap();

