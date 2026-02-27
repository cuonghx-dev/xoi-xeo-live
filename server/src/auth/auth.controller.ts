import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: { username?: string }): { token: string } {
    const username = (body.username ?? '').trim();
    if (!username || username.length > 30) {
      throw new BadRequestException('Username must be 1–30 characters');
    }
    return { token: this.authService.issueToken(username) };
  }
}
