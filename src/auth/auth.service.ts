import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  public generateRefreshToken() {
    return nanoid(64);
  }

  public generateJwtToken(payload: any, secret: string) {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '1y',
    });
  }
  public generateActivationCode() {
    return Math.floor(Math.random() * 900000) + 100000;
  }

  public validateJwtToken(token: string, key: string) {
    return this.jwtService.verifyAsync(token, {
      secret: key,
    });
  }
}
