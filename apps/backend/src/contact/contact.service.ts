import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactMessage.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!message) {
      throw new NotFoundException('Contact message not found');
    }
    return message;
  }

  async create(createContactMessageDto: CreateContactMessageDto) {
    return this.prisma.contactMessage.create({
      data: createContactMessageDto,
    });
  }

  async markAsRead(id: string) {
    await this.findOne(id);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}

