// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from '../user/users.dto';
import { User, UserDocument } from '../user/users.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../service/email.service';
import { Role } from '../roles/roles.schema';
import { User as UserType } from '../constant/type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: Model<Role>,

    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private handleError(error: any): never {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
  
      throw error;
    }
    throw new InternalServerErrorException(
      'An unexpected error occurred. Please try again later.',
    );
  }

  private generateToken(user: UserDocument): string {
    try {
      return this.jwtService.sign({
        sub: user._id,
        id: user._id,
        email: user.email,
        role: user.role.name,
      });
    } catch (error) {
      console.log(error)
      this.handleError(error);
    }
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Register a new user
  async register(userDto: UserDto): Promise<{ message: string; user: UserDocument }> {
    try {
      const existingUser = await this.userModel.findOne({
        email: userDto.email,
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
      if (!userDto.password) {
        throw new BadRequestException('Password is required');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userDto.password, saltRounds);

      let role;
      let roleId = userDto.roleId;

      if (!roleId) {
        role = await this.roleModel.findOne({ name: UserType });
        if (!role) {
          throw new BadRequestException('Role "User" not found');
        }
      } else {
        role = await this.roleModel.findById(roleId);
        if (!role) {
          throw new BadRequestException('Role not found');
        }
      }

      const newUser = new this.userModel({
        name: userDto.name,
        email: userDto.email,
        password: hashedPassword,
        city: userDto.city,
        mobile: userDto.mobile,
        role: role._id,
        isDeleted: false,
      });

      const savedUser = await newUser.save();
      return {
        message: 'Your account has been created successfully',
        user: savedUser,
      };
    } catch (error) {
      console.log(error);
      this.handleError(error);
    }
  }

  // Login a user
  async login(userDto: UserDto): Promise<{ message: string; user: Partial<User>; token: string }> {
    try {
      const user = await this.userModel
        .findOne({ email: userDto.email, isDeleted: false })
        .populate('role')
        .exec();

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!userDto.password) {
        throw new BadRequestException('Password is required');
      }

      const isPasswordValid = await bcrypt.compare(
        userDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateToken(user);

      // Only return specific user fields
      const sanitizedUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      };

      return {
        message: 'Login successful',
        user: sanitizedUser,
        token: token,
      };
    } catch (error) {
      console.log(error)
      this.handleError(error);
    }
  }

  // Forget Password

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findOne({
        email,
        isDeleted: false,
      });

      if (!user) {
        throw new BadRequestException('Email not found');
      }

      const otp = this.generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

      // Update using $set to ensure proper typing
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            otp,
            otpExpires,
          },
        },
      );

      await this.emailService.sendOTP(email, otp);

      return { message: 'OTP has been sent to your email' };
    } catch (error) {
      this.handleError(error);
    }
  }

  async verifyOtpAndResetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findOne({
        email,
        isDeleted: false,
      });

      if (!user || !user.otp || !user.otpExpires) {
        throw new BadRequestException('Invalid reset request');
      }

      if (new Date() > user.otpExpires) {
        throw new BadRequestException('OTP has expired');
      }

      if (user.otp !== otp) {
        throw new BadRequestException('Invalid OTP');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update using $set to ensure proper typing
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            otp: null,
            otpExpires: null,
          },
        },
      );

      return { message: 'Password reset successful' };
    } catch (error) {
      this.handleError(error);
    }
  }
}
