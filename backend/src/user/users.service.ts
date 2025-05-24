//users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getAll(): Promise<Partial<User>[]> {
    const users = await this.userModel
      .find({ isDeleted: false })
      .populate('role')
      .exec();
    return users.map(({ password, isDeleted, ...rest }) => rest.toObject());
  }

  async getById(id: string): Promise<Partial<User>> {
    const user = await this.userModel
      .findOne({ _id: id, isDeleted: false })
      .populate('role')
      .exec();
    
    if (!user) {
      throw new NotFoundException('User not found or has been deleted');
    }

    const { password, isDeleted, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async delete(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isDeleted = true;
    await user.save();
    return { message: 'User deleted successfully' };
  }

  async update(
    id: string,
    updateData: Partial<User>,
  ): Promise<Partial<User>> {
    const user = await this.userModel.findOne({ _id: id, isDeleted: false });
    if (!user) {
      throw new NotFoundException('User not found or has been deleted');
    }

    // Remove sensitive fields from updateData
    const {
      password,
      isDeleted,
      _id,
      otp,
      otpExpires,
      ...safeUpdateData
    } = updateData;

    // Update the user
    Object.assign(user, safeUpdateData);
    const updatedUser = await user.save();

    // Remove sensitive fields from response
    const {
      password: _,
      isDeleted: __,
      otp: ___,
      otpExpires: ____,
      ...result
    } = updatedUser.toObject();

    return result;
  }
}
