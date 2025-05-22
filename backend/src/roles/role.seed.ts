// src/roles/role.seed.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './roles.entity';
import { Admin, ContentAdmin, User } from '../constant/type';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';

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
// Get all roles
  async getAllRoles(): Promise<RoleEntity[]> {
    return this.roleRepo.find();
  }

  // Create a new role (Optional)
  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = this.roleRepo.create(createRoleDto);
    return this.roleRepo.save(role);
  }

  // Delete a role by ID
  async deleteRole(id: string): Promise<void> {
    await this.roleRepo.delete(id);
  }

   // Get a single role by ID
  async getRoleById(id: string): Promise<RoleEntity> {
    const role = await this.roleRepo.findOne({
      where: { id }, // Correct query to find by ID
    });

    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }


  // Update a role by ID
  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.roleRepo.findOne({
      where: { id }, // Correct query to find by ID
    });

    if (!role) {
      throw new Error('Role not found');
    }

    role.name = updateRoleDto.name;
    return this.roleRepo.save(role);
  }


}
