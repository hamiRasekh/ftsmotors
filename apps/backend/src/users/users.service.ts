import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByPhone(phone: string, includePassword = false) {
    if (includePassword) {
      return this.prisma.user.findUnique({
        where: { phone },
      });
    }
    return this.prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(phone: string, password: string, role = 'USER', name?: string, email?: string) {
    const existingUser = await this.findByPhone(phone);
    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        name,
        email,
        role: role as any,
      },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createWithoutPassword(phone: string, name?: string, email?: string) {
    const existingUser = await this.findByPhone(phone);
    if (existingUser) {
      // Return existing user with same select structure
      return this.prisma.user.findUnique({
        where: { phone },
        select: {
          id: true,
          phone: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    // Create user with a random password hash (user won't use password login)
    const randomPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    return this.prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        name,
        email,
        role: 'USER',
      },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: { name?: string; email?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new ConflictException('رمز عبور فعلی صحیح نیست');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
      },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
