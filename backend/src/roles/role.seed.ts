// src/roles/role.seed.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './roles.entity';
import { Admin, ContentAdmin, User } from 'constant/type';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
  ) {}

  async seedRoles() {
    const roles = [Admin, ContentAdmin, User];
    for (const roleName of roles) {
      const exists = await this.roleRepo.findOne({ where: { name: roleName } });
      if (!exists) {
        const role = this.roleRepo.create({ name: roleName });
        await this.roleRepo.save(role);
      }
    }
  }
}
