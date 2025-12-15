import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TicketStatus } from '@prisma/client';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  async create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    return this.ticketsService.create(req.user.userId, createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'List of tickets' })
  async findAll(@Request() req, @Query('status') status?: TicketStatus) {
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
    return this.ticketsService.findAll(userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket details' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
    return this.ticketsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update ticket status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  async update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a ticket (Admin only)' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add a message to a ticket' })
  @ApiResponse({ status: 201, description: 'Message added successfully' })
  async addMessage(
    @Param('id') id: string,
    @Body() createMessageDto: CreateTicketMessageDto,
    @Request() req,
  ) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.ticketsService.addMessage(id, createMessageDto.content, isAdmin);
  }
}

