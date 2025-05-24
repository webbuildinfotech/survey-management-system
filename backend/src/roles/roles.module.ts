// src/roles/role.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleSeedService } from './role.seed';  // Import the RoleSeedService
import { Role, RoleSchema } from './roles.schema';
import { RoleController } from './role.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [RoleSeedService],  // Register RoleSeedService here
  controllers: [RoleController],  // Register the controller here
  exports: [RoleSeedService],  // Export if it's needed in other modules
})
export class RoleModule {}
