import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(userId: string, createMessageDto: CreateChatMessageDto, isAdmin: boolean) {
    return this.prisma.chatMessage.create({
      data: {
        userId,
        content: createMessageDto.content,
        isAdmin,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findAll(limit = 50) {
    return this.prisma.chatMessage.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findByUser(userId: string, limit = 50) {
    return this.prisma.chatMessage.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });
  }
}

