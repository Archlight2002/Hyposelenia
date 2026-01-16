import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 1, description: 'ID of the chatroom', required: true, minimum: 1 })
  roomId: number;

  @ApiProperty({ example: 'Alice', description: 'Sender name' })
  sender: string;

  @ApiProperty({ example: 'Hello!', description: 'Message text' })
  text: string;
}
