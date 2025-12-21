import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTicketDto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        ...createTicketDto,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async findAll(userId?: string, status?: TicketStatus) {
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }

    const tickets = await this.prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tickets;
  }

  async findOne(id: string, userId?: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (userId && ticket.userId !== userId) {
      throw new ForbiddenException('You do not have access to this ticket');
    }

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.findOne(id);
    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ticket.delete({
      where: { id },
    });
  }

  async addMessage(ticketId: string, content: string, isAdmin: boolean) {
    await this.findOne(ticketId);
    
    const message = await this.prisma.ticketMessage.create({
      data: {
        ticketId,
        content,
        isAdmin,
      },
    });

    // Update ticket's updatedAt timestamp
    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    return message;
  }
}

