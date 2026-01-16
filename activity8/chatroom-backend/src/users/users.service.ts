import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async register(dto: CreateUserDto) {
    const username = dto.username?.trim();
    const password = dto.password?.trim();

    if (!username || !password) {
      throw new BadRequestException('Username and password are required.');
    }

    const existing = await this.repo.findOne({ where: { username } });
    if (existing) {
      throw new BadRequestException('Username already taken.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.repo.create({ username, passwordHash });
    const saved = await this.repo.save(user);

    return { id: saved.id, username: saved.username };
  }

  async login(dto: LoginUserDto) {
    const username = dto.username?.trim();
    const password = dto.password ?? '';

    const user = await this.repo.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    user.sessionToken = randomUUID();
    await this.repo.save(user);

    return { id: user.id, username: user.username, token: user.sessionToken };
  }

  async findByToken(token: string) {
    if (!token) {
      return null;
    }
    return this.repo.findOne({ where: { sessionToken: token } });
  }
}
