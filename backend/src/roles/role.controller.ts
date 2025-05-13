// src/roles/role.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RoleSeedService } from './role.seed';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleSeedService) {}

  // Get all roles
  @Get()
  async getAllRoles() {
    return this.roleService.getAllRoles();
  }

  // Get a single role by ID
  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  // Create a new role
  @Post('')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  // Update a role by ID
  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  // Delete a role by ID
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    await this.roleService.deleteRole(id);
    return { message: 'Role deleted successfully' };
  }
}
