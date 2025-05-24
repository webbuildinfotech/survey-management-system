// src/roles/role.seed.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './roles.schema';
import { Admin, ContentAdmin, User } from '../constant/type';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async seedRoles() {
    const roles = [Admin, ContentAdmin, User];
    for (const roleName of roles) {
      const exists = await this.roleModel.findOne({ name: roleName });
      if (!exists) {
        await this.roleModel.create({ name: roleName });
      }
    }
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new this.roleModel(createRoleDto);
    return role.save();
  }

  async deleteRole(id: string): Promise<void> {
    const result = await this.roleModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Role not found');
    }
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.name = updateRoleDto.name;
    return role.save();
  }
}
