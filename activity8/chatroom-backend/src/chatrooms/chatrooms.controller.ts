import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ChatroomsService } from './chatrooms.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';

@ApiTags('Chatrooms')
@Controller('chatrooms')
export class ChatroomsController {
  constructor(private readonly svc: ChatroomsService) {}

  @Get()
  @ApiOperation({ summary: 'Get every available chatroom' })
  @ApiOkResponse({ description: 'List of chatrooms with metadata' })
  all() {
    return this.svc.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new chatroom' })
  @ApiBody({ type: CreateChatroomDto })
  @ApiOkResponse({ description: 'Chatroom that was created' })
  create(@Body() body: CreateChatroomDto) {
    return this.svc.create(body.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chatroom by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Chatroom ID' })
  @ApiOkResponse({ description: 'Deletion acknowledged' })
  async delete(@Param('id') id: string) {
    await this.svc.delete(Number(id));
    return { success: true };
  }
}
