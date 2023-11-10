import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('isUser') {
  constructor() {
    super();
  }
}
