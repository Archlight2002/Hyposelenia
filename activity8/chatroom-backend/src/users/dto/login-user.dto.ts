import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'stellar_wanderer', description: 'Registered username' })
  username: string;

  @ApiProperty({ example: 'Str0ngP@ss!', description: 'Account password' })
  password: string;
}
