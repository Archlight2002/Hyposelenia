import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a brand new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'User successfully registered' })
  register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate an existing user' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ description: 'Authentication success payload' })
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }
}
