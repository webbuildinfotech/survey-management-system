import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const token = this.extractTokenFromHeader(request);
      
        // console.log(token);
        // console.log(request);
        if (!token) {
            throw new UnauthorizedException('Token is required for authentication');
        }

        try {
            const decoded = this.jwtService.verify(token, { 
                secret: process.env.JWT_SECRET 
            });
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromHeader(request: Request): string | null {
        const [_, token] = request.headers.authorization?.split(' ') ?? [];
        return token || null;
    }
}
