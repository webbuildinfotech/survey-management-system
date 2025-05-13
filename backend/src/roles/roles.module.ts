// src/roles/role.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleSeedService } from './role.seed';  // Import the RoleSeedService
import { RoleEntity } from './roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleSeedService],  // Register RoleSeedService here
  exports: [RoleSeedService],  // Export if it's needed in other modules
})
export class RoleModule {}
