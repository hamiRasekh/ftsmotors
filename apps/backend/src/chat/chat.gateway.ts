import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'secret',
      });

      client.data.userId = payload.sub;
      client.data.role = payload.role;
      client.join(`user:${payload.sub}`);
      
      if (payload.role === 'ADMIN') {
        client.join('admin');
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Handle disconnect
  }

  @SubscribeMessage('chat:message')
  async handleMessage(
    @MessageBody() createMessageDto: CreateChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    const isAdmin = client.data.role === 'ADMIN';

    const message = await this.chatService.createMessage(userId, createMessageDto, isAdmin);

    // Broadcast to admin room
    this.server.to('admin').emit('chat:new-message', message);
    
    // Broadcast to user's room
    this.server.to(`user:${userId}`).emit('chat:new-message', message);

    return message;
  }

  @SubscribeMessage('chat:join')
  async handleJoin(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    const isAdmin = client.data.role === 'ADMIN';

    let messages;
    if (isAdmin) {
      messages = await this.chatService.findAll(100);
    } else {
      messages = await this.chatService.findByUser(userId, 100);
    }

    client.emit('chat:messages', messages);
  }
}

