import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtOrganizationStrategy extends PassportStrategy(
  Strategy,
  "jwt-organization",
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.ORGANIZATION_JWT_KEY}`,
    });
  }

  validate(payload: any) {
    return {
      organizationId: payload.organizationId,
    };
  }
}
