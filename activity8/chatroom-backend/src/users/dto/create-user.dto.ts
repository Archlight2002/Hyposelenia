import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'stellar_wanderer', description: 'Unique username chosen during registration' })
  username: string;

  @ApiProperty({ example: 'Str0ngP@ss!', description: 'Plain text password that will be hashed before storage' })
  password: string;
}
