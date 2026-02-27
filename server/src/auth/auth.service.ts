import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  issueToken(username: string): string {
    return this.jwtService.sign({ sub: username, displayName: username });
  }
}
