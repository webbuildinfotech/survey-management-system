// src/roles/role.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { RoleSeedService } from './role.seed';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleSeedService) {}

  // Get all roles
  @Get()
  async getAllRoles(@Res() response: Response) {
    const roles = await this.roleService.getAllRoles();
    return response.status(HttpStatus.OK).json({
      length: roles.length,
      data: roles,
    });
  }

  // Get a single role by ID
  @Get(':id')
  async getRoleById(@Param('id') id: string, @Res() response: Response) {
    const role = await this.roleService.getRoleById(id);
    return response.status(HttpStatus.OK).json({
      data: role,
    });
  }

  // Create a new role
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto, @Res() response: Response) {
    const role = await this.roleService.createRole(createRoleDto);
    return response.status(HttpStatus.CREATED).json({
      message: 'Role created successfully',
      data: role,
    });
  }

  // Update a role by ID
  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() response: Response,
  ) {
    const role = await this.roleService.updateRole(id, updateRoleDto);
    return response.status(HttpStatus.OK).json({
      message: 'Role updated successfully',
      data: role,
    });
  }

  // Delete a role by ID
  @Delete(':id')
  async deleteRole(@Param('id') id: string, @Res() response: Response) {
    await this.roleService.deleteRole(id);
    return response.status(HttpStatus.OK).json({
      message: 'Role deleted successfully',
    });
  }
}
