import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './chatrooms/chatroom.entity';
import { Message } from './messages/message.entity';
import { ChatroomsModule } from './chatrooms/chatrooms.module';
import { MessagesModule } from './messages/messages.module';
import { ChatGateway } from './chat.gateway';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'Hyposelenia.db',
      entities: [Chatroom, Message, User],
      synchronize: true, // dev only
    }),
    ChatroomsModule,
    MessagesModule,
    UsersModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
