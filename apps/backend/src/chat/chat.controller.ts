import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  @ApiOperation({ summary: 'Create a chat message' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  async createMessage(@Body() createMessageDto: CreateChatMessageDto, @Request() req) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.chatService.createMessage(req.user.userId, createMessageDto, isAdmin);
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get chat messages' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  async getMessages(@Request() req, @Query('limit') limit?: number) {
    const isAdmin = req.user.role === 'ADMIN';
    if (isAdmin) {
      return this.chatService.findAll(limit);
    }
    return this.chatService.findByUser(req.user.userId, limit);
  }
}

