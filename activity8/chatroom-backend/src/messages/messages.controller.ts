import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private svc: MessagesService) {}

  @Get(':roomId')
  @ApiOperation({ summary: 'Retrieve messages for a room' })
  @ApiParam({
    name: 'roomId',
    type: Number,
    description: 'Chatroom ID',
    required: true,
    example: 1,
  })
  @ApiOkResponse({ description: 'Messages associated with the room' })
  get(@Param('roomId') roomId: string) {
    return this.svc.getMessages(Number(roomId));
  }

  @Post()
  @ApiOperation({ summary: 'Post a new message to a room' })
  @ApiBody({
    type: CreateMessageDto,
    required: true,
    description: 'Payload used to persist a chat message for a room',
    examples: {
      sample: {
        value: {
          roomId: 1,
          sender: 'Nova',
          text: 'Hey crew, docking complete.',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Message that was persisted' })
  create(@Body() body: CreateMessageDto) {
    return this.svc.sendMessage(body);
  }
}
