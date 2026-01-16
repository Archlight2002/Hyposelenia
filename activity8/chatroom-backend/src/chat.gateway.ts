import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages/messages.service';
import { ChatroomsService } from './chatrooms/chatrooms.service';
import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private messagesSvc: MessagesService,
    private chatroomsSvc: ChatroomsService,
    private usersSvc: UsersService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: number; sender: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.userId) {
      client.emit('error', { message: 'Please log in before sending messages.' });
      return;
    }

    const payload = { roomId: data.roomId, sender: client.data.username, text: data.text };
    const saved = await this.messagesSvc.sendMessage(payload);
    // broadcast to room only
    this.server.to(String(saved.roomId)).emit('newMessage', saved);
    return saved;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody() data: { roomId: number }, @ConnectedSocket() client: Socket) {
    if (!client.data.userId) {
      client.emit('error', { message: 'Please log in before joining rooms.' });
      return;
    }
    // Check if room exists in DB
    const room = await this.chatroomsSvc.getAll();
    if (!room.find(r => r.id === Number(data.roomId))) {
      client.emit('error', { message: 'Room does not exist.' });
      return;
    }
    client.join(String(data.roomId));
    client.emit('joinedRoom', { roomId: data.roomId });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@MessageBody() data: { roomId: number }, @ConnectedSocket() client: Socket) {
    client.leave(String(data.roomId));
    client.emit('leftRoom', { roomId: data.roomId });
  }

  @SubscribeMessage('authenticate')
  async handleAuthenticate(@MessageBody() data: { token: string }, @ConnectedSocket() client: Socket) {
    if (!data?.token) {
      client.data.userId = null;
      client.data.username = null;
      client.emit('authCleared');
      return;
    }

    const user = await this.usersSvc.findByToken(data.token);
    if (!user) {
      client.data.userId = null;
      client.data.username = null;
      client.emit('authError', { message: 'Invalid or expired session token.' });
      return;
    }

    client.data.userId = user.id;
    client.data.username = user.username;
    client.emit('authSuccess', { userId: user.id, username: user.username });
  }
}
