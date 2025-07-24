import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
  }

  async getUserByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async createUser(name: string, email: string): Promise<any> {
    return this.prisma.user.create({
      data: {
        name,
        email,
      },
    });
  }

  async updateUser(id: number, name: string, email: string): Promise<any> {
    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
      },
    });
  }

  async deleteUser(id: number): Promise<any> {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}
