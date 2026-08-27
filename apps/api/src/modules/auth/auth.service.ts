import { Injectable } from '@nestjs/common';
import { UsersService, type SafeUser } from '../users/users.service';
import { RegisterDto } from './register.dto';

/**
 * T016 — đăng ký + băm mật khẩu. JWT login/refresh là T017.
 */
@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async register(dto: RegisterDto): Promise<{ user: SafeUser }> {
    const user = await this.users.create({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      role: dto.role ?? 'Student',
    });
    return { user };
  }
}
