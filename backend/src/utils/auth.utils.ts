import * as crypto from 'crypto';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Admin } from 'constant/type';

/**
 * Ensures that the authenticated user is accessing only their own data.
 * @param request - Incoming request containing the authenticated user.
 * @param targetUserId - ID from route param (resource owner).
 */
export function checkUserAuthorization(request: Request, targetUserId: string): void {
  const userId = request.user?.id;

  if (!userId) {
    throw new UnauthorizedException('User not authenticated');
  }

  if (userId !== targetUserId) {
    throw new UnauthorizedException('You are not authorized to access this data');
  }
}


/**
 * Allows access if the user is accessing their own data or is an admin.
 * @param request - The incoming request with user info.
 * @param targetUserId - The user ID in the route.
 */
export function checkUserAdminAuthorization(request: Request, targetUserId: string): void {
  const user = request.user;

  if (!user || !user.id) {
    throw new UnauthorizedException('User not authenticated');
  }

  const isAdmin = user.role === Admin;
  const isSelf = user.id === targetUserId;

  if (!isAdmin && !isSelf) {
    throw new UnauthorizedException('You are not authorized to access this data');
  }
}


// Utility function to validate if the input is an email or not
export const validateEmail = (input: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

// Utility function to generate OTP (6 digits)
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
};

// Placeholder function to send OTP via email
export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  console.log(`OTP sent to email ${email}: ${otp}`);
};

// Placeholder function to send OTP via SMS
export const sendOtpSms = async (mobile: string, otp: string): Promise<void> => {
  console.log(`OTP sent to mobile ${mobile}: ${otp}`);
};
